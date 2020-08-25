package com.droi.reader.model.bean.packages;

import com.droi.reader.model.bean.BaseBean;
import com.droi.reader.model.bean.BookChapterBean;

import java.util.List;


public class BookChapterPackage extends BaseBean {
    private List<BookChapterBean> data;

    public List<BookChapterBean> getData() {
        return data;
    }

    public void setData(List<BookChapterBean> data) {
        this.data = data;
    }


}
