package com.droi.reader.model.remote;

import com.droi.reader.model.bean.BaseBean;
import com.droi.reader.model.bean.BookChapterBean;
import com.droi.reader.model.bean.ChapterInfoBean;
import com.droi.reader.model.bean.MusicBean;
import com.droi.reader.model.bean.ReadHotbeansInfoBean;
import com.droi.reader.model.bean.SignBean;
import com.droi.reader.model.bean.SignStatusBean;
import com.droi.reader.model.bean.TodayReadTsBean;
import com.droi.reader.model.bean.packages.AdInfoPackage;
import com.droi.reader.model.bean.packages.ChapterInfoPackage;
import com.droi.reader.model.bean.packages.FreeAdVertBean;

import java.util.List;

import io.reactivex.Single;
import okhttp3.RequestBody;
import retrofit2.Retrofit;

public class RemoteRepository {
    private static final String TAG = "RemoteRepository";

    private static RemoteRepository sInstance;
    private Retrofit mRetrofit;
    private BookApi mBookApi;

    private RemoteRepository(){
        mRetrofit = RemoteHelper.getInstance()
                .getRetrofit();

        mBookApi = mRetrofit.create(BookApi.class);
    }

    public static RemoteRepository getInstance(){
        if (sInstance == null){
            synchronized (RemoteHelper.class){
                if (sInstance == null){
                    sInstance = new RemoteRepository();
                }
            }
        }
        return sInstance;
    }

    public Single<List<BookChapterBean>> getBookChapters(long bookId){
        return mBookApi.getBookChapterPackage(bookId)
                .map(bean -> {
//                    if (bean.getMixToc() == null){
//                        return new ArrayList<BookChapterBean>(1);
//                    }
//                    else {
//                        return bean.getMixToc().getChapters();
//                    }
                    return bean.getData();
                });
    }

    /**
     * 注意这里用的是同步请求
     * @param bookId
     * @param id
     * @return
     */
    public Single<ChapterInfoBean> getChapterInfo(long bookId, long id){
        return mBookApi.getChapterInfoPackage(bookId, id)
                .map(bean -> bean.getData());
    }

    public Single<ChapterInfoPackage> getChapterInfoPackage(long bookId, long id) {
        return mBookApi.getChapterInfoPackage(bookId, id);
    }


    /**
     * 加入书架
     * @param requestBody
     * @return
     */
    public Single<BaseBean> addToBookShelf(RequestBody requestBody) {
        return mBookApi.addToBookShelf(requestBody);
    }

    public Single<AdInfoPackage> getAd(RequestBody requestBody) {
        return mBookApi.getAd(requestBody);
    }

    /**
     * 获取用户注册时间
     */
    public Single<FreeAdVertBean> freeAdVert(RequestBody requestBody) {
        return mBookApi.freeAdVert(requestBody);
    }

    /**
     * 统计自更新下载次数
     */
    public Single<BaseBean> appDownload(RequestBody requestBody) {
        return mBookApi.appDownload(requestBody);
    }

    /**
     * 获取今日是否签到
     */
    public Single<SignStatusBean> getTodaySign(RequestBody requestBody) {
        return mBookApi.getTodaySign(requestBody)
                .map(bean -> bean.getData());
    }

    /**
     * 签到
     */
    public Single<SignBean> userSign(RequestBody requestBody) {
        return mBookApi.userSign(requestBody)
                .map(bean -> bean.getData());
    }

    /**
     * 背景音乐(初次进入/换一批)
     */
    public Single<MusicBean> getBgm(int start, int size, RequestBody requestBody) {
        return mBookApi.getBgm(start, size, requestBody)
                .map(bean -> bean.getData());
    }

    /**
     * 获取今日阅读时长(分钟)
     * token
     */
    public Single<TodayReadTsBean> todayReadTs(RequestBody requestBody) {
        return mBookApi.todayReadTs(requestBody)
                .map(bean -> bean.getData());
    }

    /**
     * 增加今日阅读时长
     * token
     * task_type:5:30分钟,6:60分钟,7:120分钟,8:180分钟
     */
    public Single<ReadHotbeansInfoBean> readHotbeansInfo(RequestBody requestBody) {
        return mBookApi.readHotbeansInfo(requestBody)
                .map(bean -> bean.getData());
    }
}
