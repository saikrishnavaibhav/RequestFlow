package com.requestflow.responses;

import java.util.List;

public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String userName;
	private String emailId;
	private String phoneNumber;
	private List<String> roles;
	

	public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
		this.token = accessToken;
		this.id = id;
		this.userName = username;
		this.emailId = email;
		this.roles = roles;
	}

	public JwtResponse(String accessToken, Long id, String username, String email,String phoneNumber, List<String> roles) {
		this.token = accessToken;
		this.id = id;
		this.userName = username;
		this.emailId = email;
		this.phoneNumber = phoneNumber;
		this.roles = roles;
	}

	public String getAccessToken() {
		return token;
	}

	public void setAccessToken(String accessToken) {
		this.token = accessToken;
	}

	public String getTokenType() {
		return type;
	}

	public void setTokenType(String tokenType) {
		this.type = tokenType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return emailId;
	}

	public void setEmail(String email) {
		this.emailId = email;
	}

	public String getUsername() {
		return userName;
	}

	public void setUsername(String username) {
		this.userName = username;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public List<String> getRoles() {
		return roles;
	}


}
