package com.requestflow.requests;

import java.util.List;

import com.requestflow.validations.ValidPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern.Flag;
import jakarta.validation.constraints.Size;


public class SignupRequest {
	
	@NotBlank(message = "firstName must not be empty")
    @Size(min = 3, max = 20, message = "length must be between 3 to 20 characters")
	private String firstName;
	
	@NotBlank(message = "lastName must not be empty")
    @Size(min = 3, max = 20, message = "length must be between 3 to 20 characters")
	private String lastName;
	
	@NotBlank(message = "userName must not be empty")
    @Size(min = 3, max = 20, message = "length must be between 3 to 20 characters")
	private String userName;
	
	private String role;
	
	@NotBlank(message = "emailId must not be empty")
    @Size(max = 50)
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}",
            flags = Flag.CASE_INSENSITIVE, message = "please enter valid emailId")
	private String emailId;
	
	@ValidPassword
    private String password;
	
	private List<String> roles;

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

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	@Override
	public String toString() {
		return "SignupRequest [firstName=" + firstName + ", lastName=" + lastName + ", userName=" + userName + ", role="
				+ role + ", emailId=" + emailId + ", password=" + password + ", roles=" + roles + "]";
	}

}
