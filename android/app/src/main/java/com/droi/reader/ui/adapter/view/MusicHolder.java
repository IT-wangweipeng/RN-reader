package com.droi.reader.ui.adapter.view;


import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.droi.reader.R;

public class MusicHolder extends RecyclerView.ViewHolder {

    public ImageView itemIcon;
    public TextView itemName;
    public LinearLayout itemChangeLayout;
    public ImageView itemChangeIcon;
    public TextView itemChangeText;

    public MusicHolder(@NonNull View itemView) {
        super(itemView);
        itemIcon = itemView.findViewById(R.id.item_icon);
        itemName = itemView.findViewById(R.id.item_name);
        itemChangeLayout = itemView.findViewById(R.id.item_change_layout);
        itemChangeIcon = itemView.findViewById(R.id.item_change_icon);
        itemChangeText = itemView.findViewById(R.id.item_change_text);
    }
}
