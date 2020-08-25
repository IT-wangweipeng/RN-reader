package com.droi.reader.utils;

import android.util.Log;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class CommonUtils {

    public static int getRandomAdType(){
        int[] pool = SharedPreUtils.getInstance().getAdSourcePool();
        if(pool.length == 0){
            return 0;
        }
        Random random = new Random();
        int index = random.nextInt(pool.length);
        int adType = pool[index];
//        LogUtils.i("yy","getRandomAdType-->index="+index+",adType="+adType);
        return adType;
    }

    public static boolean randVerticalAd(){
        int[] pool =new int[]{1,1,1,1,2};//1:竖屏视频广告 2:横屏广告  目前竖屏广告与横屏广告比例为4:1
        Random random = new Random();
        int index = random.nextInt(pool.length);
        int adType = pool[index];
        if(adType == 1){
            LogUtils.i("yy","randVerticalAd true");
            return true;
        }else{
            LogUtils.i("yy","randVerticalAd false");
            return false;
        }
    }

    public static List getRandomListFilter(List paramList, List filterList, int count){
        if(paramList.size() < count){
            return paramList;
        }
        Random random=new Random();
        List<Integer> tempList=new ArrayList<Integer>();
        List<Object> newList=new ArrayList<Object>();
        int temp = 0;
        for(int i = 0; i<count; i++){
            temp=random.nextInt(paramList.size());//将产生的随机数作为被抽list的索引
            if(!tempList.contains(temp) && !filterList.contains(paramList.get(temp))){
                tempList.add(temp);
                newList.add(paramList.get(temp));
            } else{
                i--;
            }
        }
        return newList;
    }

    public static  List getRandomList(List paramList,int count){
        if(paramList.size() < count){
            return paramList;
        }
        Random random=new Random();
        List<Integer> tempList=new ArrayList<Integer>();
        List<Object> newList=new ArrayList<Object>();
        int temp = 0;
        for(int i = 0; i<count; i++){
            temp=random.nextInt(paramList.size());//将产生的随机数作为被抽list的索引
            if(!tempList.contains(temp)){
                tempList.add(temp);
                newList.add(paramList.get(temp));
            } else{
                i--;
            }
        }
        return newList;
    }

    private static final int MIN_DELAY_TIME = 1000;  // 两次点击间隔不能少于1000ms
    private static long lastClickTime = System.currentTimeMillis();

    public static boolean isFastClick() {
        boolean flag = false;
        long currentClickTime = System.currentTimeMillis();
        if ((currentClickTime - lastClickTime) <= MIN_DELAY_TIME) {
            flag = true;
        }
        lastClickTime = currentClickTime;
        return flag;
    }

    //头条开屏广告位ID
    public static String getTTAdSplashSlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.TT_AD_SPLASH_SLOT_ID_CHANNEL29;
                break;
            case 31:
                slotId = Constant.TT_AD_SPLASH_SLOT_ID_CHANNEL31;
                break;
            case 32:
                slotId = Constant.TT_AD_SPLASH_SLOT_ID_CHANNEL32;
                break;
            default:
                slotId = Constant.TT_AD_SPLASH_SLOT_ID;
                break;
        }
        return slotId;
    }
    //头条激励视频广告位ID
    public static String getTTAdRewardSlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.TT_AD_REWARD_SLOT_ID_CHANNEL29;
                break;
            case 31:
                slotId = Constant.TT_AD_REWARD_SLOT_ID_CHANNEL31;
                break;
            case 32:
                slotId = Constant.TT_AD_REWARD_SLOT_ID_CHANNEL32;
                break;
            default:
                slotId = Constant.TT_AD_REWARD_SLOT_ID;
                break;
        }
        return slotId;
    }
    //头条章节中横屏广告位id
    public static String getTTAdInfo1SlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.TT_AD_INFO_SLOT_ID1_CHANNEL29;
                break;
            case 31:
                slotId = Constant.TT_AD_INFO_SLOT_ID1_CHANNEL31;
                break;
            case 32:
                slotId = Constant.TT_AD_INFO_SLOT_ID1_CHANNEL32;
                break;
            default:
                slotId = Constant.TT_AD_INFO_SLOT_ID1;
                break;
        }
        return slotId;
    }
    //头条详情页广告位id
    public static String getTTAdInfo2SlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.TT_AD_INFO_SLOT_ID2_CHANNEL29;
                break;
            case 31:
                slotId = Constant.TT_AD_INFO_SLOT_ID2_CHANNEL31;
                break;
            case 32:
                slotId = Constant.TT_AD_INFO_SLOT_ID2_CHANNEL32;
                break;
            default:
                slotId = Constant.TT_AD_INFO_SLOT_ID2;
                break;
        }
        return slotId;
    }
    //头条章节中竖屏广告位id
    public static String getTTAdInfo3SlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.TT_AD_INFO_SLOT_ID3_CHANNEL29;
                break;
            case 31:
                slotId = Constant.TT_AD_INFO_SLOT_ID3_CHANNEL31;
                break;
            case 32:
                slotId = Constant.TT_AD_INFO_SLOT_ID3_CHANNEL32;
                break;
            default:
                slotId = Constant.TT_AD_INFO_SLOT_ID3;
                break;
        }
        return slotId;
    }

    //广点通开屏广告位ID
    public static String getGDTAdSplashSlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.GDT_AD_SPLASH_SLOT_ID_CHANNEL29;
                break;
            case 31:
                slotId = Constant.GDT_AD_SPLASH_SLOT_ID_CHANNEL31;
                break;
            case 32:
                slotId = Constant.GDT_AD_SPLASH_SLOT_ID_CHANNEL32;
                break;
            default:
                slotId = Constant.GDT_AD_SPLASH_SLOT_ID;
                break;
        }
        return slotId;
    }
    //广点通激励视频广告位ID
    public static String getGDTAdRewardSlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.GDT_AD_REWARD_SLOT_ID_CHANNEL29;
                break;
            case 31:
                slotId = Constant.GDT_AD_REWARD_SLOT_ID_CHANNEL31;
                break;
            case 32:
                slotId = Constant.GDT_AD_REWARD_SLOT_ID_CHANNEL32;
                break;
            default:
                slotId = Constant.GDT_AD_REWARD_SLOT_ID;
                break;
        }
        return slotId;
    }
    //广点通章节中横屏广告位id
    public static String getGDTAdInfo1SlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.GDT_AD_INFO_SLOT_ID1_CHANNEL29;
                break;
            case 31:
                slotId = Constant.GDT_AD_INFO_SLOT_ID1_CHANNEL31;
                break;
            case 32:
                slotId = Constant.GDT_AD_INFO_SLOT_ID1_CHANNEL32;
                break;
            default:
                slotId = Constant.GDT_AD_INFO_SLOT_ID1;
                break;
        }
        return slotId;
    }
    //广点通详情页广告位id
    public static String getGDTAdInfo2SlotId(){
        String slotId;
        switch(Constant.CHANNEL){
            case 29:
                slotId = Constant.GDT_AD_INFO_SLOT_ID2_CHANNEL29;
                break;
            case 31:
                slotId = Constant.GDT_AD_INFO_SLOT_ID2_CHANNEL31;
                break;
            case 32:
                slotId = Constant.GDT_AD_INFO_SLOT_ID2_CHANNEL32;
                break;
            default:
                slotId = Constant.GDT_AD_INFO_SLOT_ID2;
                break;
        }
        return slotId;
    }

}
