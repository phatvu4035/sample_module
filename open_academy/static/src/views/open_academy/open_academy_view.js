/** @odoo-module **/

import { _lt } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { GroupByMenu } from "@web/search/group_by_menu/group_by_menu";
import { standardViewProps } from "@web/views/helpers/standard_view_props";
import { useSetupView } from "@web/views/helpers/view_hook";
import { Layout } from "@web/views/layout";
import { useModel } from "@web/views/helpers/model";
import { OpenAcademyArchParser } from "@open_academy/views/open_academy/open_academy_arch_parser";
import { OpenAcademyModel } from "./open_academy_model";
import { OpenAcademyRenderer } from "./open_academy_renderer";
import { SearchModel } from "@web/search/search_model";

const viewRegistry = registry.category("views");

const { Component } = owl;

export class OpenAcademyView extends Component {
    setup() {
        super.setup(...arguments)
        let modelParams = {};
        if (this.props.state) {
            modelParams = this.props.state.metaData;
        } else {
            const { arch, fields } = this.props;
            const parser = new this.constructor.ArchParser();
            const archInfo = parser.parse(arch, fields);
            modelParams = {
                fieldAttrs: archInfo.fieldAttrs,
                fields: this.props.fields,
                groupBy: archInfo.groupBy,
                mode: archInfo.mode || "bar",
                order: archInfo.order || null,
                resModel: this.props.resModel,
                title: archInfo.title || this.env._t("Untitled"),
            };
        }
        this.model = useModel(this.constructor.Model, modelParams);
    }
}

class OpenAcademySearchModel extends SearchModel {
    _getIrFilterDescription() {
        this.preparingIrFilterDescription = true;
        const result = super._getIrFilterDescription(...arguments);
        this.preparingIrFilterDescription = false;
        return result;
    }
}

OpenAcademyView.template = "open_academy.OpenAcademyView";
OpenAcademyView.buttonTemplate = "open_academy.OpenAcademyView.Buttons";

OpenAcademyView.components = { GroupByMenu, Renderer: OpenAcademyRenderer, Layout };

OpenAcademyView.defaultProps = {

};

OpenAcademyView.props = {
    ...standardViewProps
};

OpenAcademyView.type = 'open_academy';

OpenAcademyView.display_name = _lt("Open Academy");
OpenAcademyView.icon = "fa-bar-chart";
OpenAcademyView.multiRecord = true;

OpenAcademyView.Model = OpenAcademyModel;
OpenAcademyView.SearchModel = OpenAcademySearchModel;
OpenAcademyView.ArchParser = OpenAcademyArchParser;


OpenAcademyView.searchMenuTypes = ["filter", "groupBy", "comparison", "favorite"];

viewRegistry.add('open_academy', OpenAcademyView);
