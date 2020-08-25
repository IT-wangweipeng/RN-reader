package com.droi.reader.presenter.contract;

import com.droi.reader.model.bean.BookChapterBean;
import com.droi.reader.ui.base.BaseContract;
import com.droi.reader.widget.page.TxtChapter;

import java.util.List;

public interface ReadContract extends BaseContract {
    interface View extends BaseContract.BaseView {
        void showCategory(List<BookChapterBean> bookChapterList);
        void finishChapter();
        void errorChapter();
    }

    interface Presenter extends BaseContract.BasePresenter<View>{
        void loadCategory(long bookId);
        void loadChapter(long bookId, List<TxtChapter> bookChapterList);
    }
}
