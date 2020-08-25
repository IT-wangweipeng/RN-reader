package com.droi.reader.ui.adapter;

import android.view.View;
import android.view.ViewGroup;

import com.droi.reader.R;
import com.droi.reader.ui.adapter.view.CategoryHolder;
import com.droi.reader.ui.base.EasyAdapter;
import com.droi.reader.ui.base.adapter.IViewHolder;
import com.droi.reader.widget.page.TxtChapter;

import java.util.Collections;

public class CategoryAdapter extends EasyAdapter<TxtChapter> {
    public boolean orderFlag = true;
    private boolean isNightMode = false;
    private int currentSelected = 0;
    private int userIsVip = 0;

    @Override
    protected IViewHolder<TxtChapter> onCreateViewHolder(int viewType) {
        return new CategoryHolder();
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view = super.getView(position, convertView, parent);
        CategoryHolder holder = (CategoryHolder) view.getTag();

        if (position == currentSelected) {
            holder.setSelectedChapter();
        } else {
            if(mList.get(position).getIsvip() == 1 && userIsVip == 0) {
                holder.setTextColor(R.color.nb_text_disable);
                holder.setLockImageVisible(true);
            } else {
                holder.setLockImageVisible(false);
                if (isNightMode) {
                    holder.setTextColor(R.color.white);
                } else {
                    holder.setTextColor(R.color.nb_text_default);
                }
            }
        }

        return view;
    }

    public void setChapter(int pos) {
        currentSelected = pos;
        notifyDataSetChanged();
    }

    public void reverseItems() {
        Collections.reverse(mList);
        currentSelected = mList.size() - 1 - currentSelected;
        orderFlag = !orderFlag;
        notifyDataSetChanged();
    }

    public void setNightMode(boolean isNightMode) {
        this.isNightMode = isNightMode;
        notifyDataSetChanged();
    }

    public void setUserIsVip(int userIsVip){
        this.userIsVip = userIsVip;
    }
}
