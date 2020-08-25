package com.droi.reader.widget.page;

import android.view.View;

import com.droi.reader.model.bean.packages.AdInfoPackage;

import java.util.List;

public class TxtPage {
    int position;
    String title;
    int titleLines; //当前 lines 中为 title 的行数。
    List<String> lines;

    boolean isVip;
    boolean hasChapterLastAd;
    boolean hasChapterAd;
    float adLeft;
    float adTop;
    float adRight;
    float adBottom;
    View adView;

    // 章节末广告(看视频免30分钟广告区域)
    float adEx1Left;
    float adEx1Top;
    float adEx1Right;
    float adEx1Bottom;

    // 章节末广告(规则说明区域)
    float adEx2Left;
    float adEx2Top;
    float adEx2Right;
    float adEx2Bottom;

    // 章节中广告上方tip区域
    float adTipLeft;
    float adTipTop;
    float adTipRight;
    float adTipBottom;

    // 章节中广告下方login tip区域
    float adLoginTipLeft;
    float adLoginTipTop;
    float adLoginTipRight;
    float adLoginTipBottom;

    //vip_step_1 区域
    float vipStep1Left;
    float vipStep1Top;
    float vipStep1Right;
    float vipStep1Bottom;

    //vip_step_2 区域
    float vipStep2Left;
    float vipStep2Top;
    float vipStep2Right;
    float vipStep2Bottom;


}
