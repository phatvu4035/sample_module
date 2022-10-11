/** @odoo-module **/

import { evaluateExpr } from "@web/core/py_js/py";
import { XMLParser } from "@web/core/utils/xml";
import { archParseBoolean } from "@web/views/helpers/utils";

export class OpenAcademyArchParser extends XMLParser {
    parse(arch) {
        const archInfo = {
            defaultOrder: null,
            fieldAttrs: {},
            rowGroupBys: [], // store the defined group_by used on rows
            widgets: {}, // wigdets defined in the arch
        };

        this.visitXML(arch, (node) => {
            switch (node.tagName) {
                case "field": {
                    let fieldName = node.getAttribute("name"); // exists (rng validation)

                    archInfo.fieldAttrs[fieldName] = {};
                    if (node.hasAttribute("string")) {
                        archInfo.fieldAttrs[fieldName].string = node.getAttribute("string");
                    }
                    if (node.hasAttribute("invisible")) {
                        const isInvisible = Boolean(evaluateExpr(node.getAttribute("invisible")));
                        if (isInvisible) {
                            archInfo.fieldAttrs[fieldName].isInvisible = true;
                            break;
                        }
                    }

                    if (node.hasAttribute("interval")) {
                        fieldName += ":" + node.getAttribute("interval");
                    }
                    if (node.hasAttribute("widget")) {
                        archInfo.widgets[fieldName] = node.getAttribute("widget");
                    }
                    if (node.getAttribute("type") === "measure" || node.hasAttribute("operator")) {
                        archInfo.activeMeasures.push(fieldName);
                    }
                    if (node.getAttribute("type") === "col") {
                        archInfo.colGroupBys.push(fieldName);
                    }
                    if (node.getAttribute("type") === "row") {
                        archInfo.rowGroupBys.push(fieldName);
                    }
                    break;
                }
            }
        });

        return archInfo;
    }
}
