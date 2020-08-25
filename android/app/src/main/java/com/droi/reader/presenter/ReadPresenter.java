package com.droi.reader.presenter;

import android.util.Log;

import com.droi.reader.MainApplication;
import com.droi.reader.model.bean.BookChapterBean;
import com.droi.reader.model.bean.ChapterInfoBean;
import com.droi.reader.model.bean.packages.ChapterInfoPackage;
import com.droi.reader.model.local.BookRepository;
import com.droi.reader.model.remote.RemoteRepository;
import com.droi.reader.presenter.contract.ReadContract;
import com.droi.reader.ui.base.RxPresenter;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.RxUtils;
import com.droi.reader.widget.page.TxtChapter;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

import com.umeng.analytics.MobclickAgent;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

import io.reactivex.Single;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;

public class ReadPresenter extends RxPresenter<ReadContract.View>
        implements ReadContract.Presenter {
    private static final String TAG = "ReadPresenter";

    private Subscription mChapterSub;

    @Override
    public void loadCategory(long bookId) {
        Disposable disposable = RemoteRepository.getInstance()
                .getBookChapters(bookId)
                .doOnSuccess(new Consumer<List<BookChapterBean>>() {
                    @Override
                    public void accept(List<BookChapterBean> bookChapterBeen) throws Exception {
                        //进行设定BookChapter所属的书的id。
                        for (BookChapterBean bookChapter : bookChapterBeen) {
//                            bookChapter.setId(MD5Utils.strToMd5By16(bookChapter.getLink()));
                            bookChapter.setId(bookChapter.getId());
                            bookChapter.setBook_id(bookId);
                        }
                    }
                })
                .compose(RxUtils::toSimpleSingle)
                .subscribe(
                        beans -> {
                            mView.showCategory(beans);
                        }
                        ,
                        e -> {
                            //TODO: Haven't grate conversation method.
                            LogUtils.e(TAG,"loadCategory--> e="+e.toString());
                        }
                );
        addDisposable(disposable);
    }

    @Override
    public void loadChapter(long bookId, List<TxtChapter> bookChapters) {
        int size = bookChapters.size();

        //取消上次的任务，防止多次加载
        if (mChapterSub != null) {
            mChapterSub.cancel();
        }

        List<Single<ChapterInfoPackage>> chapterInfoPackages = new ArrayList<>(bookChapters.size());
        ArrayDeque<String> titles = new ArrayDeque<>(bookChapters.size());

        // 将要下载章节，转换成网络请求。
        for (int i = 0; i < size; ++i) {
            TxtChapter bookChapter = bookChapters.get(i);
            // 网络中获取数据
            Single<ChapterInfoPackage> chapterInfoPackageSingle = RemoteRepository.getInstance()
                    .getChapterInfoPackage(bookChapter.getBookId(), bookChapter.getId());
            chapterInfoPackages.add(chapterInfoPackageSingle);

            titles.add(bookChapter.getTitle());
        }

        Single.concat(chapterInfoPackages)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        new Subscriber<ChapterInfoPackage>() {
                            String title = titles.poll();

                            @Override
                            public void onSubscribe(Subscription s) {
                                s.request(Integer.MAX_VALUE);
                                mChapterSub = s;
                            }

                            @Override
                            public void onNext(ChapterInfoPackage chapterInfoPackage) {
                                LogUtils.i("yy","onNext() chapterInfoPackage status="+chapterInfoPackage.getStatus()+", message="+ chapterInfoPackage.getMessage());
                                if (chapterInfoPackage.getStatus() == 200) {
                                    //*/ add umeng maidian
                                    HashMap<String,String> map = new HashMap<String,String>();
                                    map.put("book_id", "" + chapterInfoPackage.getData().getBook_id());
                                    map.put("chapter_id", "" + chapterInfoPackage.getData().getChapter_id());
                                    MobclickAgent.onEvent(MainApplication.getContext(), "book_read_page_chapter_clicked", map);
                                    //*/

                                    //存储数据
                                    BookRepository.getInstance().saveChapterInfo(
                                            bookId, chapterInfoPackage.getData().getChapter_id(), title, chapterInfoPackage.getData().getContent()
                                    );
                                    mView.finishChapter();
                                    //将获取到的数据进行存储
                                    title = titles.poll();
                                } else {
                                    //只有第一个加载失败才会调用errorChapter
                                    if (bookChapters.get(0).getTitle().equals(title)) {
                                        mView.errorChapter();
                                    }
                                }
                            }

                            @Override
                            public void onError(Throwable t) {
                                LogUtils.i("gg","onError() t="+t.toString());
                                //只有第一个加载失败才会调用errorChapter
                                if (bookChapters.get(0).getTitle().equals(title)) {
                                    mView.errorChapter();
                                }
                            }

                            @Override
                            public void onComplete() {
                            }
                        }
                );
    }

    @Override
    public void detachView() {
        super.detachView();
        if (mChapterSub != null) {
            mChapterSub.cancel();
        }
    }

}
