package com.requestflow.entities;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;

@Entity
public class RequestEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String requestId;
	
	@Lob
	private byte[] file;
	
	private String status;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinTable(	name = "current_status", 
				joinColumns = @JoinColumn(name = "request_Id"), 
				inverseJoinColumns = @JoinColumn(name = "status_Id"))
	Set<ApprovalEntity> approvals = new HashSet<>();

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getRequestId() {
		return requestId;
	}

	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}

	public byte[] getFile() {
		return file;
	}

	public void setFile(byte[] file) {
		this.file = file;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Set<ApprovalEntity> getApprovals() {
		return approvals;
	}

	public void setApprovals(Set<ApprovalEntity> approvals) {
		this.approvals = approvals;
	}

	@Override
	public String toString() {
		return "RequestEntity [id=" + id + ", requestId=" + requestId + ", file=" + Arrays.toString(file) + ", status="
				+ status + ", approvals=" + approvals + "]";
	}
	
}
