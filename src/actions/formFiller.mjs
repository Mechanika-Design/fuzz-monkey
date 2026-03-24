import starwars from 'starwars';
import chalk from 'chalk';
import * as utils from '../utils.mjs';

function draftTextFromTemplate(template) {
    if (template.text != null) return template.text;
    const truncate = Math.random() > 0.15;
    const length = utils.randomBetween(0, truncate ? 20 : Infinity);
    return starwars().substring(0, utils.randomBetween(0, length));
}

export default async function formFiller({ page, output, template }) {
    const tpl = template || {};
    const draftText = draftTextFromTemplate(tpl);
    const replay =
        typeof tpl.fieldIndex === 'number' && tpl.fieldIndex >= 0;

    let result = null;
    try {
        result = await page.evaluate(
            (serialized) => {
                const { tpl, draftText, replay } = serialized;

                function getFillable() {
                    const out = [];
                    for (const el of document.querySelectorAll('input')) {
                        const t = (el.type || 'text').toLowerCase();
                        if (
                            [
                                'hidden',
                                'submit',
                                'button',
                                'image',
                                'reset',
                                'file',
                            ].includes(t)
                        )
                            continue;
                        if (t === 'checkbox')
                            out.push({ el, kind: 'checkbox' });
                        else if (t === 'radio') out.push({ el, kind: 'radio' });
                        else out.push({ el, kind: 'text' });
                    }
                    for (const el of document.querySelectorAll('textarea'))
                        out.push({ el, kind: 'textarea' });
                    for (const el of document.querySelectorAll('select'))
                        out.push({ el, kind: 'select' });
                    return out;
                }

                function dispatchValue(el) {
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }

                const fields = getFillable();
                if (fields.length === 0) {
                    return { skipped: true };
                }

                const idx = replay
                    ? Math.min(
                          Math.max(0, tpl.fieldIndex),
                          fields.length - 1
                      )
                    : Math.floor(Math.random() * fields.length);
                const { el, kind } = fields[idx];

                if (kind === 'text' || kind === 'textarea') {
                    const inputType =
                        kind === 'textarea'
                            ? 'textarea'
                            : (el.type || 'text').toLowerCase();
                    let value;
                    if (replay && tpl.text != null) {
                        value = String(tpl.text);
                    } else if (inputType === 'number') {
                        value = String(Math.floor(Math.random() * 10000));
                    } else if (inputType === 'color') {
                        value = `#${Math.floor(Math.random() * 0xffffff)
                            .toString(16)
                            .padStart(6, '0')}`;
                    } else if (inputType === 'range') {
                        const min = Number(el.min) || 0;
                        const max = Number(el.max) || 100;
                        value = String(
                            min + Math.floor(Math.random() * (max - min + 1))
                        );
                    } else {
                        value = draftText;
                    }

                    el.focus();
                    el.value = '';
                    el.value = value;
                    dispatchValue(el);
                    return {
                        fieldIndex: idx,
                        kind,
                        inputType,
                        text: value,
                    };
                }

                if (kind === 'checkbox') {
                    const checked = replay
                        ? !!tpl.checked
                        : Math.random() > 0.5;
                    el.focus();
                    el.checked = checked;
                    dispatchValue(el);
                    return { fieldIndex: idx, kind, checked };
                }

                if (kind === 'radio') {
                    el.focus();
                    el.checked = true;
                    el.dispatchEvent(new Event('click', { bubbles: true }));
                    dispatchValue(el);
                    return { fieldIndex: idx, kind };
                }

                if (kind === 'select') {
                    const options = [...el.options].filter((o) => !o.disabled);
                    if (options.length === 0) {
                        return { skipped: true, fieldIndex: idx, kind };
                    }
                    let optIdx;
                    if (
                        replay &&
                        typeof tpl.optionIndex === 'number' &&
                        tpl.optionIndex >= 0 &&
                        tpl.optionIndex < options.length
                    ) {
                        optIdx = tpl.optionIndex;
                    } else {
                        optIdx = Math.floor(Math.random() * options.length);
                    }
                    const opt = options[optIdx];
                    el.value = opt.value;
                    dispatchValue(el);
                    return {
                        fieldIndex: idx,
                        kind,
                        optionIndex: optIdx,
                        optionValue: opt.value,
                    };
                }

                return { skipped: true };
            },
            { tpl, draftText, replay }
        );
    } catch {}

    try {
        if (!result || result.skipped) {
            output(
                'formFiller',
                chalk.gray('no fillable fields (or empty select)')
            );
        } else if (result.kind === 'checkbox') {
            output(
                'formFiller',
                chalk.whiteBright('checkbox'),
                result.checked
                    ? chalk.green('checked')
                    : chalk.gray('unchecked')
            );
        } else if (result.kind === 'select') {
            output(
                'formFiller',
                chalk.whiteBright('select'),
                chalk.gray('option'),
                chalk.whiteBright(String(result.optionIndex)),
                chalk.gray('→'),
                chalk.white(String(result.optionValue).slice(0, 40))
            );
        } else if (result.kind === 'radio') {
            output(
                'formFiller',
                chalk.whiteBright('radio'),
                chalk.gray('field'),
                chalk.whiteBright(String(result.fieldIndex))
            );
        } else {
            const n = result.text != null ? String(result.text).length : 0;
            output(
                'formFiller',
                chalk.whiteBright(result.inputType || 'text'),
                chalk.gray('·'),
                chalk.white(String(n)),
                chalk.gray('chars')
            );
        }
    } catch {}

    if (!result || result.skipped) {
        return { name: 'formFiller', meta: { skipped: true } };
    }

    const { skipped: _s, ...meta } = result;
    return { name: 'formFiller', meta };
}
