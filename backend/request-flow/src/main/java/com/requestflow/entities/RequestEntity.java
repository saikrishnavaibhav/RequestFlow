package com.requestflow.entities;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import com.requestflow.utils.ApprovalEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

@Entity
public class RequestEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private Timestamp date;
	
	private Long userId;
	
	@Lob
	private byte[] file;
	
	@Enumerated(EnumType.STRING)
	private ApprovalEnum status;
	
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
	
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Timestamp getDate() {
		return date;
	}

	public void setDate() {
		this.date = Timestamp.valueOf(LocalDateTime.now());
	}

	public byte[] getFile() {
		return file;
	}

	public void setFile(byte[] file) {
		this.file = file;
	}

	public ApprovalEnum getStatus() {
		return status;
	}

	public void setStatus(ApprovalEnum status) {
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
		return "RequestEntity [id=" + id + ", userId=" + userId + ", date=" + date + ", file=" + Arrays.toString(file) + ", status="
				+ status + ", approvals=" + approvals + "]";
	}
	
}