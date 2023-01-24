package com.requestflow.entities;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.requestflow.utils.ApprovalEnum;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "requests")
public class RequestEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private Timestamp date;
	
	private Long userId;
	
	private String fileName;
	
	@Lob
	private byte[] file;
	
	@Enumerated(EnumType.STRING)
	private ApprovalEnum status;
	
	@OneToMany(fetch = FetchType.LAZY,cascade = {CascadeType.ALL})
	@JoinTable(	name = "current_status", 
				joinColumns = @JoinColumn(name = "request_Id"), 
				inverseJoinColumns = @JoinColumn(name = "status_Id"))
	List<ApprovalEntity> approvals = new ArrayList<>();

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

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
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

	public List<ApprovalEntity> getApprovals() {
		return approvals;
	}

	public void setApprovals(List<ApprovalEntity> approvals) {
		this.approvals = approvals;
	}

	@Override
	public String toString() {
		return "RequestEntity [id=" + id + ", date=" + date + ", userId=" + userId + ", fileName=" + fileName
				+ ", file=" + Arrays.toString(file) + ", status=" + status + ", approvals=" + approvals + "]";
	}

}
