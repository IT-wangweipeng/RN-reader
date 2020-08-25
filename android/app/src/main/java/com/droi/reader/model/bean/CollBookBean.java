package com.droi.reader.model.bean;

import android.os.Parcel;
import android.os.Parcelable;

import org.greenrobot.greendao.annotation.Entity;
import org.greenrobot.greendao.annotation.Generated;
import org.greenrobot.greendao.annotation.Id;
import org.greenrobot.greendao.annotation.ToMany;

import java.util.List;

import org.greenrobot.greendao.DaoException;

import com.droi.reader.model.gen.DaoSession;
import com.droi.reader.model.gen.BookChapterBeanDao;
import com.droi.reader.model.gen.CollBookBeanDao;


/**
 * 收藏的书籍
 */
@Entity
public class CollBookBean implements Parcelable {

    public static final int STATUS_UNCACHE = 0; //未缓存
    public static final int STATUS_CACHING = 1; //正在缓存
    public static final int STATUS_CACHED = 2;  //已经缓存

    /**
     * id : 10040
     * name : 我当冥婚师那几年
     * author : 二爷
     * word_count : 1720137
     * cover : http://i.mixs.cn/upload/cover/146/146231/146231l.jpg
     * brief :  灵馆是转为死人缔结阴婚的古玩店，某天一个危险的陌生人的到来，无意间给灵馆的主人朔瞳雪也带来了一段姻缘，以及以后无尽的麻烦。
     * keywords : 冥婚,女强,灵异,
     * complete_status : 1
     * price : 4215
     * isvip : 1
     * create_time : 1552462181
     * category_name : 未知
     * chapter_count : 863
     * start_ad_ts : 2018-12-10 16:12:46
     * end_ad_ts : 2018-12-12 16:12:46
     */

    @Id
    private long id;
    private String name;
    private String author;
    private int word_count;
    private String cover;
    private String brief;
    private String keywords;
    private int complete_status;
    private int price;
    private int isvip;
    private String create_time;
    private String category_name;
    private int chapter_count;
    private String start_ad_ts;
    private String end_ad_ts;
    private String start_vip_ts;
    private String end_vip_ts;

    //最新阅读日期
    private String lastRead;
    //是否更新或未阅读
    private boolean isUpdate = true;
    //打开指定章节
    private int specialChapterPos = -1;

    @ToMany(referencedJoinProperty = "book_id")
    private List<BookChapterBean> bookChapterList;

    protected CollBookBean(Parcel in) {
        id = in.readLong();
        name = in.readString();
        author = in.readString();
        word_count = in.readInt();
        cover = in.readString();
        brief = in.readString();
        keywords = in.readString();
        complete_status = in.readInt();
        price = in.readInt();
        isvip = in.readInt();
        create_time = in.readString();
        category_name = in.readString();
        chapter_count = in.readInt();
        start_ad_ts = in.readString();
        end_ad_ts = in.readString();
        start_vip_ts = in.readString();
        end_vip_ts = in.readString();
        lastRead = in.readString();
        isUpdate = in.readByte() != 0;
        specialChapterPos = in.readInt();
    }



    @Generated(hash = 149378998)
    public CollBookBean() {
    }



    @Generated(hash = 169603874)
    public CollBookBean(long id, String name, String author, int word_count, String cover,
            String brief, String keywords, int complete_status, int price, int isvip,
            String create_time, String category_name, int chapter_count, String start_ad_ts,
            String end_ad_ts, String start_vip_ts, String end_vip_ts, String lastRead,
            boolean isUpdate, int specialChapterPos) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.word_count = word_count;
        this.cover = cover;
        this.brief = brief;
        this.keywords = keywords;
        this.complete_status = complete_status;
        this.price = price;
        this.isvip = isvip;
        this.create_time = create_time;
        this.category_name = category_name;
        this.chapter_count = chapter_count;
        this.start_ad_ts = start_ad_ts;
        this.end_ad_ts = end_ad_ts;
        this.start_vip_ts = start_vip_ts;
        this.end_vip_ts = end_vip_ts;
        this.lastRead = lastRead;
        this.isUpdate = isUpdate;
        this.specialChapterPos = specialChapterPos;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeLong(id);
        dest.writeString(name);
        dest.writeString(author);
        dest.writeInt(word_count);
        dest.writeString(cover);
        dest.writeString(brief);
        dest.writeString(keywords);
        dest.writeInt(complete_status);
        dest.writeInt(price);
        dest.writeInt(isvip);
        dest.writeString(create_time);
        dest.writeString(category_name);
        dest.writeInt(chapter_count);
        dest.writeString(start_ad_ts);
        dest.writeString(end_ad_ts);
        dest.writeString(start_vip_ts);
        dest.writeString(end_vip_ts);
        dest.writeString(lastRead);
        dest.writeByte((byte) (isUpdate ? 1 : 0));
        dest.writeInt(specialChapterPos);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<CollBookBean> CREATOR = new Creator<CollBookBean>() {
        @Override
        public CollBookBean createFromParcel(Parcel in) {
            return new CollBookBean(in);
        }

        @Override
        public CollBookBean[] newArray(int size) {
            return new CollBookBean[size];
        }
    };
    /** Used to resolve relations */
    @Generated(hash = 2040040024)
    private transient DaoSession daoSession;
    /** Used for active entity operations. */
    @Generated(hash = 1552163441)
    private transient CollBookBeanDao myDao;

    public void setBookChapters(List<BookChapterBean> beans) {
        bookChapterList = beans;
        for (BookChapterBean bean : bookChapterList) {
            bean.setBook_id(getId());
        }
    }

    public List<BookChapterBean> getBookChapters() {
        if (daoSession == null) {
            return bookChapterList;
        } else {
            return getBookChapterList();
        }
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getWord_count() {
        return word_count;
    }

    public void setWord_count(int word_count) {
        this.word_count = word_count;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getBrief() {
        return brief;
    }

    public void setBrief(String brief) {
        this.brief = brief;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public int getComplete_status() {
        return complete_status;
    }

    public void setComplete_status(int complete_status) {
        this.complete_status = complete_status;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getIsvip() {
        return isvip;
    }

    public void setIsvip(int isvip) {
        this.isvip = isvip;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public String getCategory_name() {
        return category_name;
    }

    public void setCategory_name(String category_name) {
        this.category_name = category_name;
    }

    public int getChapter_count() {
        return chapter_count;
    }

    public void setChapter_count(int chapter_count) {
        this.chapter_count = chapter_count;
    }

    public String getStart_ad_ts() {
        return start_ad_ts;
    }

    public void setStart_ad_ts(String start_ad_ts) {
        this.start_ad_ts = start_ad_ts;
    }

    public String getEnd_ad_ts() {
        return end_ad_ts;
    }

    public void setEnd_ad_ts(String end_ad_ts) {
        this.end_ad_ts = end_ad_ts;
    }

    public String getStart_vip_ts() {
        return start_vip_ts;
    }

    public void setStart_vip_ts(String start_vip_ts) {
        this.start_vip_ts = start_vip_ts;
    }

    public String getEnd_vip_ts() {
        return end_vip_ts;
    }

    public void setEnd_vip_ts(String end_vip_ts) {
        this.end_vip_ts = end_vip_ts;
    }

    public String getLastRead() {
        return this.lastRead;
    }

    public void setLastRead(String lastRead) {
        this.lastRead = lastRead;
    }

    public boolean getIsUpdate() {
        return this.isUpdate;
    }

    public void setIsUpdate(boolean isUpdate) {
        this.isUpdate = isUpdate;
    }

    public int getSpecialChapterPos() {
        return specialChapterPos;
    }

    public void setSpecialChapterPos(int specialChapterPos) {
        this.specialChapterPos = specialChapterPos;
    }

    /**
     * To-many relationship, resolved on first access (and after reset).
     * Changes to to-many relations are not persisted, make changes to the target entity.
     */
    @Generated(hash = 978649437)
    public List<BookChapterBean> getBookChapterList() {
        if (bookChapterList == null) {
            final DaoSession daoSession = this.daoSession;
            if (daoSession == null) {
                throw new DaoException("Entity is detached from DAO context");
            }
            BookChapterBeanDao targetDao = daoSession.getBookChapterBeanDao();
            List<BookChapterBean> bookChapterListNew = targetDao
                    ._queryCollBookBean_BookChapterList(id);
            synchronized (this) {
                if (bookChapterList == null) {
                    bookChapterList = bookChapterListNew;
                }
            }
        }
        return bookChapterList;
    }

    /**
     * Resets a to-many relationship, making the next get call to query for a fresh result.
     */
    @Generated(hash = 1077762221)
    public synchronized void resetBookChapterList() {
        bookChapterList = null;
    }

    /**
     * Convenient call for {@link org.greenrobot.greendao.AbstractDao#delete(Object)}.
     * Entity must attached to an entity context.
     */
    @Generated(hash = 128553479)
    public void delete() {
        if (myDao == null) {
            throw new DaoException("Entity is detached from DAO context");
        }
        myDao.delete(this);
    }

    /**
     * Convenient call for {@link org.greenrobot.greendao.AbstractDao#refresh(Object)}.
     * Entity must attached to an entity context.
     */
    @Generated(hash = 1942392019)
    public void refresh() {
        if (myDao == null) {
            throw new DaoException("Entity is detached from DAO context");
        }
        myDao.refresh(this);
    }

    /**
     * Convenient call for {@link org.greenrobot.greendao.AbstractDao#update(Object)}.
     * Entity must attached to an entity context.
     */
    @Generated(hash = 713229351)
    public void update() {
        if (myDao == null) {
            throw new DaoException("Entity is detached from DAO context");
        }
        myDao.update(this);
    }

    /**
     * called by internal mechanisms, do not call yourself.
     */
    @Generated(hash = 159260324)
    public void __setDaoSession(DaoSession daoSession) {
        this.daoSession = daoSession;
        myDao = daoSession != null ? daoSession.getCollBookBeanDao() : null;
    }
}
