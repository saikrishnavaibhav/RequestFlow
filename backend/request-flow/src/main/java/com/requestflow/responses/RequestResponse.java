package com.requestflow.responses;

import java.util.ArrayList;
import java.util.List;

import com.requestflow.entities.ApprovalEntity;
import com.requestflow.utils.ApprovalEnum;

public class RequestResponse {
	private long id;
	
	private String date;
	
	private Long userId;
	
	private String fileName;
	
	private List<String> file;
	
	private ApprovalEnum status;
	
	List<ApprovalEntity> approvals = new ArrayList<>();

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public List<String> getFile() {
		return file;
	}

	public void setFile(List<String> file) {
		this.file = file;
	}

	public ApprovalEnum getStatus() {
		return status;
	}

	public void setStatus(ApprovalEnum status) {
		this.status = status;
	}

	public List<ApprovalEntity> getApprovals() {
		return approvals;
	}

	public void setApprovals(List<ApprovalEntity> approvals) {
		this.approvals = approvals;
	}

	@Override
	public String toString() {
		return "RequestResponse [id=" + id + ", date=" + date + ", userId=" + userId + ", fileName=" + fileName
				+ ", file=" + file + ", status=" + status + ", approvals=" + approvals + "]";
	}

}
