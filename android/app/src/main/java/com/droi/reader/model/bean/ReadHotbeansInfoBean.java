package com.droi.reader.model.bean;

public class ReadHotbeansInfoBean {

    /**
     * tip : {"cur_tip":true,"next_tip":true}
     */

    private TipBean tip;

    public TipBean getTip() {
        return tip;
    }

    public void setTip(TipBean tip) {
        this.tip = tip;
    }

    public static class TipBean {
        /**
         * cur_tip : true
         * next_tip : true
         */

        private boolean cur_tip;
        private boolean next_tip;

        public boolean isCur_tip() {
            return cur_tip;
        }

        public void setCur_tip(boolean cur_tip) {
            this.cur_tip = cur_tip;
        }

        public boolean isNext_tip() {
            return next_tip;
        }

        public void setNext_tip(boolean next_tip) {
            this.next_tip = next_tip;
        }
    }
}
