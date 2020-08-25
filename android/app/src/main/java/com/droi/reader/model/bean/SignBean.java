package com.droi.reader.model.bean;

public class SignBean {


    /**
     * sign_days : 1
     * task_complete_state : false
     * today_is_sign : 1
     */

    private int sign_days;
    private boolean task_complete_state;
    private int today_is_sign;

    public int getSign_days() {
        return sign_days;
    }

    public void setSign_days(int sign_days) {
        this.sign_days = sign_days;
    }

    public boolean isTask_complete_state() {
        return task_complete_state;
    }

    public void setTask_complete_state(boolean task_complete_state) {
        this.task_complete_state = task_complete_state;
    }

    public int getToday_is_sign() {
        return today_is_sign;
    }

    public void setToday_is_sign(int today_is_sign) {
        this.today_is_sign = today_is_sign;
    }
}
