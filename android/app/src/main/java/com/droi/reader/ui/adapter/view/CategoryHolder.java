package com.droi.reader.ui.adapter.view;

import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.droi.reader.R;
import com.droi.reader.ui.base.adapter.ViewHolderImpl;
import com.droi.reader.utils.BookManager;
import com.droi.reader.widget.page.TxtChapter;

public class CategoryHolder extends ViewHolderImpl<TxtChapter> {

    private TextView mTvChapter;
    private ImageView mCategoryLockImage;

    @Override
    public void initView() {
        mTvChapter = findById(R.id.category_tv_chapter);
        mCategoryLockImage = findById(R.id.category_iv_lock);
    }

    @Override
    public void onBind(TxtChapter value, int pos) {
        //首先判断是否该章已下载
        Drawable drawable = null;

        //TODO:目录显示设计的有点不好，需要靠成员变量是否为null来判断。
        //如果没有链接地址表示是本地文件
        if (value.getId() == 0) {
            drawable = ContextCompat.getDrawable(getContext(), R.drawable.selector_category_load);
        } else {
            if (value.getBookId() != 0
                    && BookManager
                    .isChapterCached(value.getBookId(),value.getId(), value.getTitle())) {
                drawable = ContextCompat.getDrawable(getContext(), R.drawable.selector_category_load);
            } else {
                drawable = ContextCompat.getDrawable(getContext(), R.drawable.selector_category_unload);
            }
        }

        mTvChapter.setSelected(false);
        mTvChapter.setTextColor(ContextCompat.getColor(getContext(), R.color.nb_text_default));
        mTvChapter.setCompoundDrawablesWithIntrinsicBounds(drawable, null, null, null);
        mTvChapter.setText(value.getTitle());
    }

    @Override
    protected int getItemLayoutId() {
        return R.layout.item_category;
    }

    public void setSelectedChapter() {
        mTvChapter.setTextColor(ContextCompat.getColor(getContext(), R.color.light_red));
        mTvChapter.setSelected(true);
    }

    public void setTextColor(int colorId){
        mTvChapter.setTextColor(ContextCompat.getColor(getContext(), colorId));
    }

    public void setLockImageVisible(boolean show) {
        if(show){
            mCategoryLockImage.setVisibility(View.VISIBLE);
        } else {
            mCategoryLockImage.setVisibility(View.INVISIBLE);
        }
    }
}
