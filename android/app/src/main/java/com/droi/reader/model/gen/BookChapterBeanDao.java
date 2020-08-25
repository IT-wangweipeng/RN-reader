package com.droi.reader.model.gen;

import java.util.List;
import android.database.Cursor;
import android.database.sqlite.SQLiteStatement;

import org.greenrobot.greendao.AbstractDao;
import org.greenrobot.greendao.Property;
import org.greenrobot.greendao.internal.DaoConfig;
import org.greenrobot.greendao.database.Database;
import org.greenrobot.greendao.database.DatabaseStatement;
import org.greenrobot.greendao.query.Query;
import org.greenrobot.greendao.query.QueryBuilder;

import com.droi.reader.model.bean.BookChapterBean;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/** 
 * DAO for table "BOOK_CHAPTER_BEAN".
*/
public class BookChapterBeanDao extends AbstractDao<BookChapterBean, Long> {

    public static final String TABLENAME = "BOOK_CHAPTER_BEAN";

    /**
     * Properties of entity BookChapterBean.<br/>
     * Can be used for QueryBuilder and for referencing column names.
     */
    public static class Properties {
        public final static Property Id = new Property(0, long.class, "id", true, "_id");
        public final static Property Book_id = new Property(1, long.class, "book_id", false, "BOOK_ID");
        public final static Property Title = new Property(2, String.class, "title", false, "TITLE");
        public final static Property Create_time = new Property(3, String.class, "create_time", false, "CREATE_TIME");
        public final static Property Sort = new Property(4, int.class, "sort", false, "SORT");
        public final static Property Word_count = new Property(5, int.class, "word_count", false, "WORD_COUNT");
        public final static Property Isvip = new Property(6, int.class, "isvip", false, "ISVIP");
        public final static Property TaskName = new Property(7, String.class, "taskName", false, "TASK_NAME");
        public final static Property Unreadble = new Property(8, boolean.class, "unreadble", false, "UNREADBLE");
        public final static Property Start = new Property(9, long.class, "start", false, "START");
        public final static Property End = new Property(10, long.class, "end", false, "END");
    }

    private Query<BookChapterBean> collBookBean_BookChapterListQuery;

    public BookChapterBeanDao(DaoConfig config) {
        super(config);
    }
    
    public BookChapterBeanDao(DaoConfig config, DaoSession daoSession) {
        super(config, daoSession);
    }

    /** Creates the underlying database table. */
    public static void createTable(Database db, boolean ifNotExists) {
        String constraint = ifNotExists? "IF NOT EXISTS ": "";
        db.execSQL("CREATE TABLE " + constraint + "\"BOOK_CHAPTER_BEAN\" (" + //
                "\"_id\" INTEGER PRIMARY KEY NOT NULL ," + // 0: id
                "\"BOOK_ID\" INTEGER NOT NULL ," + // 1: book_id
                "\"TITLE\" TEXT," + // 2: title
                "\"CREATE_TIME\" TEXT," + // 3: create_time
                "\"SORT\" INTEGER NOT NULL ," + // 4: sort
                "\"WORD_COUNT\" INTEGER NOT NULL ," + // 5: word_count
                "\"ISVIP\" INTEGER NOT NULL ," + // 6: isvip
                "\"TASK_NAME\" TEXT," + // 7: taskName
                "\"UNREADBLE\" INTEGER NOT NULL ," + // 8: unreadble
                "\"START\" INTEGER NOT NULL ," + // 9: start
                "\"END\" INTEGER NOT NULL );"); // 10: end
    }

    /** Drops the underlying database table. */
    public static void dropTable(Database db, boolean ifExists) {
        String sql = "DROP TABLE " + (ifExists ? "IF EXISTS " : "") + "\"BOOK_CHAPTER_BEAN\"";
        db.execSQL(sql);
    }

    @Override
    protected final void bindValues(DatabaseStatement stmt, BookChapterBean entity) {
        stmt.clearBindings();
        stmt.bindLong(1, entity.getId());
        stmt.bindLong(2, entity.getBook_id());
 
        String title = entity.getTitle();
        if (title != null) {
            stmt.bindString(3, title);
        }
 
        String create_time = entity.getCreate_time();
        if (create_time != null) {
            stmt.bindString(4, create_time);
        }
        stmt.bindLong(5, entity.getSort());
        stmt.bindLong(6, entity.getWord_count());
        stmt.bindLong(7, entity.getIsvip());
 
        String taskName = entity.getTaskName();
        if (taskName != null) {
            stmt.bindString(8, taskName);
        }
        stmt.bindLong(9, entity.getUnreadble() ? 1L: 0L);
        stmt.bindLong(10, entity.getStart());
        stmt.bindLong(11, entity.getEnd());
    }

    @Override
    protected final void bindValues(SQLiteStatement stmt, BookChapterBean entity) {
        stmt.clearBindings();
        stmt.bindLong(1, entity.getId());
        stmt.bindLong(2, entity.getBook_id());
 
        String title = entity.getTitle();
        if (title != null) {
            stmt.bindString(3, title);
        }
 
        String create_time = entity.getCreate_time();
        if (create_time != null) {
            stmt.bindString(4, create_time);
        }
        stmt.bindLong(5, entity.getSort());
        stmt.bindLong(6, entity.getWord_count());
        stmt.bindLong(7, entity.getIsvip());
 
        String taskName = entity.getTaskName();
        if (taskName != null) {
            stmt.bindString(8, taskName);
        }
        stmt.bindLong(9, entity.getUnreadble() ? 1L: 0L);
        stmt.bindLong(10, entity.getStart());
        stmt.bindLong(11, entity.getEnd());
    }

    @Override
    public Long readKey(Cursor cursor, int offset) {
        return cursor.getLong(offset + 0);
    }    

    @Override
    public BookChapterBean readEntity(Cursor cursor, int offset) {
        BookChapterBean entity = new BookChapterBean( //
            cursor.getLong(offset + 0), // id
            cursor.getLong(offset + 1), // book_id
            cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2), // title
            cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3), // create_time
            cursor.getInt(offset + 4), // sort
            cursor.getInt(offset + 5), // word_count
            cursor.getInt(offset + 6), // isvip
            cursor.isNull(offset + 7) ? null : cursor.getString(offset + 7), // taskName
            cursor.getShort(offset + 8) != 0, // unreadble
            cursor.getLong(offset + 9), // start
            cursor.getLong(offset + 10) // end
        );
        return entity;
    }
     
    @Override
    public void readEntity(Cursor cursor, BookChapterBean entity, int offset) {
        entity.setId(cursor.getLong(offset + 0));
        entity.setBook_id(cursor.getLong(offset + 1));
        entity.setTitle(cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2));
        entity.setCreate_time(cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3));
        entity.setSort(cursor.getInt(offset + 4));
        entity.setWord_count(cursor.getInt(offset + 5));
        entity.setIsvip(cursor.getInt(offset + 6));
        entity.setTaskName(cursor.isNull(offset + 7) ? null : cursor.getString(offset + 7));
        entity.setUnreadble(cursor.getShort(offset + 8) != 0);
        entity.setStart(cursor.getLong(offset + 9));
        entity.setEnd(cursor.getLong(offset + 10));
     }
    
    @Override
    protected final Long updateKeyAfterInsert(BookChapterBean entity, long rowId) {
        entity.setId(rowId);
        return rowId;
    }
    
    @Override
    public Long getKey(BookChapterBean entity) {
        if(entity != null) {
            return entity.getId();
        } else {
            return null;
        }
    }

    @Override
    public boolean hasKey(BookChapterBean entity) {
        throw new UnsupportedOperationException("Unsupported for entities with a non-null key");
    }

    @Override
    protected final boolean isEntityUpdateable() {
        return true;
    }
    
    /** Internal query to resolve the "bookChapterList" to-many relationship of CollBookBean. */
    public List<BookChapterBean> _queryCollBookBean_BookChapterList(long book_id) {
        synchronized (this) {
            if (collBookBean_BookChapterListQuery == null) {
                QueryBuilder<BookChapterBean> queryBuilder = queryBuilder();
                queryBuilder.where(Properties.Book_id.eq(null));
                collBookBean_BookChapterListQuery = queryBuilder.build();
            }
        }
        Query<BookChapterBean> query = collBookBean_BookChapterListQuery.forCurrentThread();
        query.setParameter(0, book_id);
        return query.list();
    }

}
