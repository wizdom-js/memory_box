package kr.guards.memorybox.domain.box.service;


import kr.guards.memorybox.domain.box.db.bean.BoxDetailBean;
import kr.guards.memorybox.domain.box.db.bean.BoxUserDetailBean;
import kr.guards.memorybox.domain.box.db.bean.OpenBoxReadyBean;
import kr.guards.memorybox.domain.box.request.BoxCreatePostReq;
import kr.guards.memorybox.domain.box.request.BoxModifyPutReq;

import java.util.List;

public interface BoxService {
    boolean boxCreate(BoxCreatePostReq boxCreatePostReq, Long userSeq);
    boolean boxRemove(Long boxSeq, Long userSeq);
    boolean boxModify(BoxModifyPutReq boxModifyPutReq, Long boxSeq, Long userSeq);
    List<BoxDetailBean> boxOpenList(Long userSeq);
    List<BoxDetailBean> boxCloseList(Long userSeq);
    List<BoxUserDetailBean> boxOpenUserList(Long userSeq);
    List<BoxUserDetailBean> boxCloseUserList(Long userSeq);

    // ************************** 기억함 열기 ************************** //
    List<OpenBoxReadyBean> openBoxReadyList(Long boxSeq);
    boolean openBoxReadyCheck(Long boxSeq, Long userSeq);
}

