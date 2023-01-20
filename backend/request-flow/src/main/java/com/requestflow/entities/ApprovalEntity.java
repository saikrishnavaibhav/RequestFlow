package com.requestflow.entities;

import com.requestflow.utils.ApprovalEnum;

import jakarta.persistence.*;

@Entity
@Table(name = "approvals")
public class ApprovalEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Enumerated(EnumType.STRING)
	private ApprovalEnum status;
	
	private Long approverId;
	
	private String approver;
	
	private String remarks;
	
	private Long requestId;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public ApprovalEnum getStatus() {
		return status;
	}

	public void setStatus(ApprovalEnum status) {
		this.status = status;
	}

	public Long getApproverId() {
		return approverId;
	}

	public void setApproverId(Long approverId) {
		this.approverId = approverId;
	}

	public String getApprover() {
		return approver;
	}

	public void setApprover(String approver) {
		this.approver = approver;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public Long getRequestId() {
		return requestId;
	}

	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}

	@Override
	public String toString() {
		return "ApprovalEntity [id=" + id + ", status=" + status + ", approverId=" + approverId + ", approver=" + approver + ", remarks=" + remarks
				+ ", requestId=" + requestId + "]";
	}
	
}
