package com.droi.reader.model.bean.packages;

import com.droi.reader.model.bean.BaseBean;
import com.droi.reader.model.bean.TodayReadTsBean;

public class TodayReadTsPackage extends BaseBean {
    private TodayReadTsBean data;

    public TodayReadTsBean getData() {
        return data;
    }

    public void setData(TodayReadTsBean data) {
        this.data = data;
    }
}
