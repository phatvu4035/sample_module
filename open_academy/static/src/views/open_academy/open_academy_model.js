/** @odoo-module **/

import { sortBy } from "@web/core/utils/arrays";
import { KeepLast, Race } from "@web/core/utils/concurrency";
import { rankInterval } from "@web/search/utils/dates";
import { getGroupBy } from "@web/search/utils/group_by";
import { GROUPABLE_TYPES } from "@web/search/utils/misc";
import { Model } from "@web/views/helpers/model";
import { computeReportMeasures, processMeasure } from "@web/views/helpers/utils";

export class OpenAcademyModel extends Model {
    static services = ["orm"];

    setup(params, { orm }) {
        this.model = params.resModel;
        this.columns = params.columns;
        this.orm = orm
        this.keepLast = new KeepLast();
    }
    async load(params) {
        this.data = await this.keepLast.add(
            this.orm.searchRead(this.model, params.domain, [], { limit: 100 })
        );
    }
}

OpenAcademyModel.services = ["orm"];
