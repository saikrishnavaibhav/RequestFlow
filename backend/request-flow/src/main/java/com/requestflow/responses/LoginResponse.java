package com.requestflow.responses;

import java.util.List;

public class LoginResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String userName;
	private String firstName;
	private String lastName;
	private String emailId;
	private List<String> roles;
	

	public LoginResponse(String accessToken, Long id, String username,String firstname,String lastname, String email, List<String> roles) {
		this.token = accessToken;
		this.id = id;
		this.userName = username;
		this.firstName = firstname;
		this.lastName = lastname;
		this.emailId = email;
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

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public List<String> getRoles() {
		return roles;
	}

}
