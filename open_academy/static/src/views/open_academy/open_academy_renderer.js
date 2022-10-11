/** @odoo-module **/

import { _lt } from "@web/core/l10n/translation";

const { Component, hooks } = owl;
const { useRef } = hooks;

const NO_DATA = _lt("No data");



export class OpenAcademyRenderer extends Component {
    setup() {
        this.model = this.props.model;
    }

}

OpenAcademyRenderer.template = "open_academy.OpenAcademyRenderer";
