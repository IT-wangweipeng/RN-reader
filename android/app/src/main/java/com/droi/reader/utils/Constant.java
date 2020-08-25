package com.droi.reader.utils;

import java.io.File;
import java.util.concurrent.TimeUnit;

public class Constant {
    public static final int DEFAULT_TEXT_SIZE = ScreenUtils.dpToPx(18); //3号字体
    public static final int MIN_TEXT_SIZE = ScreenUtils.dpToPx(14);
    public static final int MAX_TEXT_SIZE = ScreenUtils.dpToPx(32);
    public static final int TEXT_SIZE_STEP = ScreenUtils.dpToPx(2);


    //默认广告类型
    public static final int AD_TYPE_TT = 8;
    public static final int AD_TYPE_GDT = 10;
    public static final int DEFAULT_AD_TYPE = AD_TYPE_GDT;




    public static final int MAX_AD_NUM = 1;
    public static final int MAX_LAST_AD_NUM = 1;
    public static final int MAX_BOTTOM_AD_NUM = 1;


    public static final int CHANNEL = 8;
    public static final String TT_AD_APP_ID = "5018037";
    public static final String GDT_AD_APP_ID = "1110644832";

    //common
    public static final String TT_AD_SPLASH_SLOT_ID = "818037641";
    public static final String TT_AD_REWARD_SLOT_ID = "945281754";//激励视频模板广告
//    public static final String TT_AD_BANNER_SLOT_ID = "945281404";//banner模板广告,阅读页底部广告
    public static final String TT_AD_INFO_SLOT_ID1 = "945281374";//信息流模板广告位，上字下图，章节中广告
    public static final String TT_AD_INFO_SLOT_ID2 = "945281371";//信息流模板广告位，左图右字，详情页广告
    public static final String TT_AD_INFO_SLOT_ID3 = "945335896";//信息流模板广告位，竖屏视频广告

    public static final String GDT_AD_SPLASH_SLOT_ID = "3001216814676098";
    public static final String GDT_AD_REWARD_SLOT_ID = "3071718874471137";
//    public static final String GDT_AD_BANNER_SLOT_ID = "8011115814272108";//banner模板广告,阅读页底部广告
    public static final String GDT_AD_INFO_SLOT_ID1 = "6051513896926050";//信息流模板广告位，上字下图，章节中广告
    public static final String GDT_AD_INFO_SLOT_ID2 = "8051116856522053";//信息流模板广告位，左图右字，详情页广告


    //channel31(yuzhuang)
    public static final String TT_AD_SPLASH_SLOT_ID_CHANNEL31 = "887351683";
    public static final String TT_AD_REWARD_SLOT_ID_CHANNEL31 = "945323435";//激励视频模板广告
//    public static final String TT_AD_BANNER_SLOT_ID_CHANNEL31 = "945323426";//banner模板广告,阅读页底部广告
    public static final String TT_AD_INFO_SLOT_ID1_CHANNEL31 = "945323452";//信息流模板广告位，上字下图，章节中广告
    public static final String TT_AD_INFO_SLOT_ID2_CHANNEL31 = "945323456";//信息流模板广告位，左图右字，详情页广告
    public static final String TT_AD_INFO_SLOT_ID3_CHANNEL31 = "945336397";//信息流模板广告位，竖屏视频广告

    public static final String GDT_AD_SPLASH_SLOT_ID_CHANNEL31 = "2021322049682127";
    public static final String GDT_AD_REWARD_SLOT_ID_CHANNEL31 = "1071026099084384";
//    public static final String GDT_AD_BANNER_SLOT_ID_CHANNEL31 = "1011824049582499";//banner模板广告,阅读页底部广告
    public static final String GDT_AD_INFO_SLOT_ID1_CHANNEL31 = "3011327009583792";//信息流模板广告位，上字下图，章节中广告
    public static final String GDT_AD_INFO_SLOT_ID2_CHANNEL31 = "5041823019798002";//信息流模板广告位，左图右字，详情页广告


    //channel29(toutiao)
    public static final String TT_AD_SPLASH_SLOT_ID_CHANNEL29 = "887355131";
    public static final String TT_AD_REWARD_SLOT_ID_CHANNEL29 = "945341635";//激励视频模板广告
    public static final String TT_AD_INFO_SLOT_ID1_CHANNEL29 = "945341646";//信息流模板广告位，上字下图，章节中广告
    public static final String TT_AD_INFO_SLOT_ID2_CHANNEL29 = "945341649";//信息流模板广告位，左图右字，详情页广告
    public static final String TT_AD_INFO_SLOT_ID3_CHANNEL29 = "945341651";//信息流模板广告位，竖屏视频广告

    public static final String GDT_AD_SPLASH_SLOT_ID_CHANNEL29 = "7071325148376211";
    public static final String GDT_AD_REWARD_SLOT_ID_CHANNEL29 = "5081726178074396";
    public static final String GDT_AD_INFO_SLOT_ID1_CHANNEL29 = "1071928188073468";//信息流模板广告位，上字下图，章节中广告
    public static final String GDT_AD_INFO_SLOT_ID2_CHANNEL29 = "6091523168075444";//信息流模板广告位，左图右字，详情页广告


    //channel32(moppombi)
    public static final String TT_AD_SPLASH_SLOT_ID_CHANNEL32 = "887355817";
    public static final String TT_AD_REWARD_SLOT_ID_CHANNEL32 = "945345705";//激励视频模板广告
    public static final String TT_AD_INFO_SLOT_ID1_CHANNEL32 = "945345839";//信息流模板广告位，上字下图，章节中广告
    public static final String TT_AD_INFO_SLOT_ID2_CHANNEL32 = "945345840";//信息流模板广告位，左图右字，详情页广告
    public static final String TT_AD_INFO_SLOT_ID3_CHANNEL32 = "945345841";//信息流模板广告位，竖屏视频广告

    public static final String GDT_AD_SPLASH_SLOT_ID_CHANNEL32 = "1021229200035222";
    public static final String GDT_AD_REWARD_SLOT_ID_CHANNEL32 = "7011125200138283";
    public static final String GDT_AD_INFO_SLOT_ID1_CHANNEL32 = "2041229210530204";//信息流模板广告位，上字下图，章节中广告
    public static final String GDT_AD_INFO_SLOT_ID2_CHANNEL32 = "1041227250133245";//信息流模板广告位，左图右字，详情页广告



    // 微信分享appid
    public static final String WX_APP_ID = "wxdc3b9846a91d1826";
    // QQ分享appid
    public static final String QQ_APP_ID = "1109369270";

    /*URL_BASE*/
    public static final String DEV_API_BASE_URL = "http://10.20.70.219/read/4/" + CHANNEL + "/";
    public static final String PRODUCTION_API_BASE_URL = "https://read.mjpet.net/4/" + CHANNEL + "/";

    //wechat share url address
    public static final String DEV_WECHAT_WEBPAGE_URL = "http://10.20.70.219/webread/share/detail.html?custom=" + CHANNEL + "&sex=%d&id=%d";
    public static final String PRODUCTION_WECHAT_WEBPAGE_URL = "http://h5read.mjpet.net/share/detail.html?custom=" + CHANNEL + "&sex=%d&id=%d";


    //Book Date Convert Format
    public static final String FORMAT_BOOK_DATE = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String FORMAT_TIME = "HH:mm";
    public static final String FORMAT_FILE_DATE = "yyyy-MM-dd";
    //BookCachePath (因为getCachePath引用了Context，所以必须是静态变量，不能够是静态常量)
    public static String BOOK_CACHE_PATH = FileUtils.getCachePath()+ File.separator
            + "book_cache"+ File.separator ;
    //文件阅读记录保存的路径
    public static String BOOK_RECORD_PATH = FileUtils.getCachePath() + File.separator
            + "book_record" + File.separator;


    public static final String KEY_IS_FIRST = "KEY_IS_FIRST";
    public static final String KEY_MUSIC_GUIDE_IS_FIRST = "KEY_MUSIC_GUIDE_IS_FIRST";
    public static final String KEY_MUSIC_NETWORK_IS_FIRST = "KEY_MUSIC_NETWORK_IS_FIRST";
    public static final String KEY_MUSIC_NETWORK_CHOICE = "KEY_MUSIC_NETWORK_CHOICE";
    public static final int MUSIC_NETWORK_CHOICE_WIFI = 1;
    public static final int MUSIC_NETWORK_CHOICE_WIFI_AND_MOBILE = 2;

    public static final String KEY_NOTIFICATION_IS_FIRST = "KEY_NOTIFICATION_IS_FIRST";
    public static final String KEY_AD_OFF_TIME = "KEY_AD_OFF_TIME";
    public static final long MAX_AD_FREE_TIME = TimeUnit.MINUTES.toMillis(15);//30* 60 * 1000;
    public static final long THREE_DAY = TimeUnit.DAYS.toMillis(3);


    //广告控制相关
    public static final String KEY_AD_FEATURE = "KEY_AD_FEATURE";
    public static final String KEY_AD_TYPE = "KEY_AD_TYPE";


    public static final String KEY_AD_SOURCE_POOL = "KEY_AD_SOURCE_POOL";

    //api address
    public static final String KEY_API_ADDRESS = "KEY_API_ADDRESS";
    public static final String KEY_WECHAT_SHARE_WEBPAGE_URL = "KEY_WECHAT_SHARE_WEBPAGE_URL";

    //阅读页音乐播放/暂停开关
    public static final String KEY_MUSIC_PLAY_FEATURE = "KEY_MUSIC_PLAY_FEATURE";

    //隐私协议
    public static final String KEY_PRIVACY = "KEY_PRIVACY";

  }
