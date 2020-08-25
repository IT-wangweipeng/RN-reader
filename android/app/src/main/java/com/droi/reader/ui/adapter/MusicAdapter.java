package com.droi.reader.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.droi.reader.R;
import com.droi.reader.model.bean.MusicBean;
import com.droi.reader.ui.adapter.view.MusicHolder;
import com.droi.reader.utils.LogUtils;

import java.util.List;


public class MusicAdapter extends RecyclerView.Adapter{
    private Context mContext;
    private List<MusicBean.ListBean> mList;
    private boolean mHasMore;
    private int mSelect;
    private boolean isNightMode;

    public interface OnItemClickListener{
        void onItemClick(View view, int position);
        void onItemChangeOneClick(View view, int position);
    }

    private OnItemClickListener mOnItemClickListener;
    public void setOnItemClickLitener(OnItemClickListener onItemClickLitener){
        mOnItemClickListener = onItemClickLitener;
    }

    public MusicAdapter(Context mContext, List<MusicBean.ListBean> mList) {
        this.mContext = mContext;
        this.mList = mList;
    }

    public void setData(List<MusicBean.ListBean> data) {
        mList = data;
    }

    public void setHasMore(boolean hasMore) {
        mHasMore = hasMore;
    }

    public void setSelect(int position) {
        mSelect = position;
    }

    public int getSelect() {
        return mSelect;
    }

    public void setNightMode(boolean isNightMode) {
        this.isNightMode = isNightMode;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(mContext).inflate(R.layout.item_music, parent, false);
        return new MusicHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int position) {
        MusicHolder musicHolder = (MusicHolder)viewHolder;
        MusicBean.ListBean bean = mList.get(position);
        musicHolder.itemName.setText(bean.getName());
        if (position == mSelect) {
            musicHolder.itemIcon.setVisibility(View.VISIBLE);
            musicHolder.itemName.setTextColor(mContext.getResources().getColor(R.color.nb_read_menu_text));
        } else {
            musicHolder.itemIcon.setVisibility(View.GONE);
            if (isNightMode) {
                musicHolder.itemName.setTextColor(mContext.getResources().getColor(R.color.night_widget_font_color));
            } else {
                musicHolder.itemName.setTextColor(mContext.getResources().getColor(R.color.nb_text_category_content));
            }
        }

        musicHolder.itemChangeLayout.setOnClickListener((view)->{
            int pos = musicHolder.getLayoutPosition();
            LogUtils.i("gg","onItemChangeOneClick pos="+pos);
            mOnItemClickListener.onItemChangeOneClick(view, pos);
        });
        musicHolder.itemView.setOnClickListener(view->{
            int pos = musicHolder.getLayoutPosition();
            LogUtils.i("gg","onItemClick pos="+pos);
            mOnItemClickListener.onItemClick(view, pos);
        });
        refreshChangeOneStatus(musicHolder);

    }
    private void refreshChangeOneStatus(MusicHolder holder) {
        if(mHasMore) {
            holder.itemChangeLayout.setEnabled(true);
            if (isNightMode) {
                holder.itemChangeIcon.setBackground(mContext.getDrawable(R.drawable.ic_change_one_night));
                holder.itemChangeText.setTextColor(mContext.getResources().getColor(R.color.night_widget_font_color));
            } else {
                holder.itemChangeIcon.setBackground(mContext.getDrawable(R.drawable.ic_change_one_enable));
                holder.itemChangeText.setTextColor(mContext.getResources().getColor(R.color.nb_text_category_content));
            }
        } else {
            holder.itemChangeLayout.setEnabled(false);
            if(isNightMode) {
                holder.itemChangeIcon.setBackground(mContext.getDrawable(R.drawable.ic_change_one_night_disable));
                holder.itemChangeText.setTextColor(mContext.getResources().getColor(R.color.music_change_one_night_disable));
            } else {
                holder.itemChangeIcon.setBackground(mContext.getDrawable(R.drawable.ic_change_one_disable));
                holder.itemChangeText.setTextColor(mContext.getResources().getColor(R.color.music_change_one_disable));
            }

        }
    }


    @Override
    public int getItemCount() {
        return mList.size();
    }
}
