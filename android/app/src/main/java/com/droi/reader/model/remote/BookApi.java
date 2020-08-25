package com.droi.reader.model.remote;

import com.droi.reader.model.bean.BaseBean;
import com.droi.reader.model.bean.MusicBean;
import com.droi.reader.model.bean.packages.AdInfoPackage;
import com.droi.reader.model.bean.packages.BookChapterPackage;
import com.droi.reader.model.bean.packages.ChapterInfoPackage;
import com.droi.reader.model.bean.packages.FreeAdVertBean;
import com.droi.reader.model.bean.packages.MusicPackage;
import com.droi.reader.model.bean.packages.ReadHotbeansInfoPackage;
import com.droi.reader.model.bean.packages.SignPackage;
import com.droi.reader.model.bean.packages.SignStatusPackage;
import com.droi.reader.model.bean.packages.TodayReadTsPackage;

import io.reactivex.Single;
import okhttp3.RequestBody;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface BookApi {

    /**
     * 获取书籍的章节总列表
     * @param bookId
     * @return
     */
    @GET("book/chapter/list/{bookId}")
    Single<BookChapterPackage> getBookChapterPackage(@Path("bookId") long bookId);

    /**
     * 章节的内容
     * 这里采用的是同步请求。
     * @param bookId
     * @param id
     * @return
     */
    @GET("book/chapter/content/{bookId}/{id}")
    Single<ChapterInfoPackage> getChapterInfoPackage(@Path("bookId") long bookId, @Path("id") long id);


    /**
     * 加入书架
     */
    @POST("book/favorites/add")
    Single<BaseBean> addToBookShelf(@Body RequestBody requestBody);

    /**
     *  获取广告
     */
    @POST("http://ads.adroi.com.cn/search.shtml")
    Single<AdInfoPackage> getAd(@Body RequestBody requestBody);

    /**
     * 获取用户注册时间
     */
    @POST("user/freeadvert")
    Single<FreeAdVertBean> freeAdVert(@Body RequestBody requestBody);

    /**
     * 统计自更新下载次数
     */
    @POST("appdownload")
    Single<BaseBean> appDownload(@Body RequestBody requestBody);

    /**
     * 获取今日是否签到
     */
    @POST("user/today/sign")
    Single<SignStatusPackage> getTodaySign(@Body RequestBody requestBody);


    /**
     * 签到
     */
    @POST("user/hotbens/payment")
    Single<SignPackage> userSign(@Body RequestBody requestBody);

    /**
     * 背景音乐(初次进入/换一批)
     */
    @POST("book/content/bgm/{start}/{size}")
    Single<MusicPackage> getBgm(@Path("start") int start, @Path("size") int size, @Body RequestBody requestBody);

    /**
     * 获取今日阅读时长(分钟)
     * token
     */
    @POST("user/today/read/ts")
    Single<TodayReadTsPackage> todayReadTs(@Body RequestBody requestBody);

    /**
     * 增加今日阅读时长
     * token
     * task_type
     * 5:30分钟
     * 6:60分钟
     * 7:120分钟
     * 18:180分钟
     */
    @POST("user/read/hotbeans/info")
    Single<ReadHotbeansInfoPackage> readHotbeansInfo(@Body RequestBody requestBody);

}
