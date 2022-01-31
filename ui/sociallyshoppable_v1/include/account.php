 <?php include 'include/headerSigned.php'; ?>


	



	<div class="mid_content account-page">
		<div class="container_inner clearfix">


			<ul class="breadcrumbs no_border">
				<li>My Account</li> 
			</ul>

			<div class="profile-container">
				<!-- Begin Profile Left Menu -->
				<div class="profile-left">
					<div class="menu_wrap">
						<ul class="profile-menu">
							<li class="active red"><a href="">My Profile</a></li>
							<li>
								<a href="#">Shops</a>
								<ul class="sub-item">
									<li><a href="top_ten.html">Top 10</a></li>
									<li><a href="all_store.html">All</a></li>
								</ul>
							</li>
							<li>
								<a href="#">Social</a>
								<ul class="sub-item">
									<li><a href="">Settings</a></li>
									<li><a href="">Support</a></li>
								</ul>
							</li>
							<li><a href="">Order History</a></li>
							<li><a href="">Shopping Bag</a></li>
							<li><a href="">Wish List</a></li>
						</ul>
						<ul class="profile-menu">
							<li><a href="company.html">Company</a></li>
							<li><a href="customer_service.html">Customer Services</a></li>
							<li><a href="policy.html">Policies</a></li>
						</ul>
						<div class="signOut">Sign Out</div>
					</div>

				</div>
				<!-- End Profile Left Menu -->
				<!-- Begin Profile Content -->
				<div class="profile-content">
					<form method="get" action="">
						<div class="box-preview">
							<div class="preview-image uploadPhoto border-none">
								<div class="uploadPhoto_inner">
									<img class="preview-img" src="images/blank.gif" alt="">
								</div>
									<div class="upload_picture_popup popUp">
										<div class="upload_pto_ttl">Upload Photo</div>
										<ul>
											<li><a href="#"><i class="icon instagrm"></i> Import from Instagram</a></li>
											<li><a href="#"><i class="icon pinterst"></i> Import from Pinterest</a></li>
											<li><a href="#"><i class="icon fb"></i> Import from Facebook</a></li>
											<li><a href="#"><i class="icon twitter"></i> Import from Twitter</a></li>
											<li><a href="#"><i class="icon library"></i> Import from Library</a></li>
											<li><a href="#"><i class="icon take_photo"></i> Take Photo</a></li>
										</ul>
										<div class="upload_cancel"><a href="">Cancel</a></div>
									</div>									
							</div>
							<div class="preview-content">
								<div class="form-group edit_username showCircle">
									<input type="text" value="" name="username" placeholder="Username">
									<div class="popUp">
										<div class="btn black_btn">Update</div> 
										<a href="#" class="btn cancel_btn">Cancel</a>
									</div>
									<!-- search by word 'backend' in js to close the popup -->
								</div>
							</div>
						</div>
						<div class="box-user-info">
							<div class="user-info-container form-container">
								<div class="form-row">
									<div class="form-group title">
										<label for="cmb-title">Title</label>
										<div class="form-group-by">
											<div class="defaultSt">
												<select>
													<option class="cmb-title-option" value="0">Mr</option>
													<option class="cmb-title-option" value="1">Mrs</option>
												</select>
											</div>
										</div>
									</div>
									<div class="form-group first-name form-required">
										<label for="input-firstname">First Name</label>
										<div class="form-group-by">
											<input type="text" name="input-firstname" value="" placeholder="">
										</div>
									</div>
									<div class="form-group adjm">
										<label for="input-mi">MI</label>
										<div class="form-group-by">
											<input type="text" class="input-mi" name="input-mi" value="" placeholder="">
										</div>
									</div>
									<div class="form-group last-name form-required">
										<label for="input-lastname">Last Name</label>
										<div class="form-group-by">
											<input type="text" class="input-lastname" name="input-lastname" value="" placeholder="">
										</div>
									</div>
								</div>
								<div class="form-row">
									<div class="form-group form-required email-address">
										<label for="input-email">Email Address</label>
										<div class="form-group-by">
											<input type="text" class="input-email" name="input-email" value="" placeholder="">
										</div>
									</div>
								</div>
								<div class="form-row subcribe-row">
									<div class="form-group">
										<label for="input-lastname">Yes I want to receive emails updates for:</label>
										<div class="form-group-by">
											<div class="checkbox-wrapper">
												<input id="yesemail" type="checkbox" name="checkbox-subcribe" value="" checked="">
												<label for="yesemail">SociallyShoppable.com</label>
											</div>
											<div class="checkbox-wrapper">
												<input id="noemail" type="checkbox" name="checkbox-subcribe" value="" checked="">
												<label for="noemail">Soc. Shop. STYLE</label>
											</div>
										</div>
									</div>
								</div>
								<div class="form-row gender-row">
									<div class="form-group form-required">
										<label for="input-gender">Gender</label>
										<div class="form-group-by">
											<div class="radio-wrapper">
												<input type="radio" name="input-gender" value="female" id="genF">
												<label for="genF" class="input-gender-label">female</label>
											</div>
											<div class="radio-wrapper">
												<input type="radio" name="input-gender" value="male" id="genM">
												<label for="genM" class="input-gender-label">male</label>
											</div>
										</div>
									</div>
									<div class="form-group form-group-dob">
										<label for="cmb-month">Birthday</label>
										<div class="form-group-by">
											<div class="form-birthday month">
												<div class="defaultSt">
													<select>
														<option value="">month</option>
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														<option value="4">4</option>
														<option value="5">5</option>
														<option value="6">6</option>
														<option value="7">7</option>
														<option value="8">8</option>
														<option value="9">9</option>
														<option value="10">10</option>
														<option value="11">11</option>
														<option value="12">12</option>
													</select>
												</div>
											</div>
											<div class="form-birthday day">
												<div class="defaultSt">
													<select>
														<option value="">day</option>
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														<option value="4">4</option>
														<option value="5">5</option>
														<option value="6">6</option>
														<option value="7">7</option>
														<option value="8">8</option>
														<option value="9">9</option>
														<option value="10">10</option>
														<option value="11">11</option>
														<option value="12">12</option>
														<option value="13">13</option>
														<option value="14">14</option>
														<option value="15">15</option>
														<option value="16">16</option>
														<option value="17">17</option>
														<option value="18">18</option>
														<option value="19">19</option>
														<option value="20">20</option>
														<option value="12">21</option>
														<option value="12">22</option>
														<option value="12">23</option>
														<option value="12">24</option>
														<option value="12">25</option>
														<option value="12">26</option>
														<option value="12">27</option>
														<option value="12">28</option>
														<option value="12">29</option>
														<option value="12">30</option>
													</select>
												</div>
											</div>
											<div class="form-birthday year">
												<div class="defaultSt">
													<select>
														<option value="">year</option>
														<option value="2015">2015</option>
														<option value="2014">2014</option>
														<option value="2013">2013</option>
														<option value="2012">2012</option>
														<option value="2011">2011</option>
														<option value="2010">2010</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="box-user-address">
							<h2>Address</h2>
							<div class="user-info-container form-container">
								<div class="form-row">
									<div class="form-group country">
										<label for="cmb-country">Country</label>
										<div class="form-group-by">
											<div class="defaultSt">
												<select>
													<option>USA</option>
													<option>Canada</option>
													<option>Euro</option>
													<option>Australia</option>
													<option>Sweden</option>
													<option>Denmark</option>
													<option>France</option>
													<option>Japan</option>
													<option>Mexico</option>
												</select>
											</div>
										</div>
									</div>
									<div class="form-group currency ">
										<label for="cmb-currency">Currency</label>
										<div class="form-group-by no-scroll">
											<div class="defaultSt">
												<select>
													<option value="0">USD</option>
													<option value="0">EURO</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class="form-row">
									<div class="form-group address">
										<label for="input-address">Address</label>
										<div class="form-group-by">
											<input type="text" class="input-address" name="input-address" value="" placeholder="Address">
										</div>
									</div>
									<div class="form-group aptOrSuite">
										<label for="input-apt-suit">Apt / Suite</label>
										<div class="form-group-by">
											<input type="text" class="input-apt-suit" name="input-apt-suit" value="" placeholder="Apt/Suit">
										</div>
									</div>
								</div>
								<div class="form-row">
									<div class="form-group city">
										<label for="input-city">City</label>
										<div class="form-group-by">
											<input type="text" class="input-city" name="input-city" value="" placeholder="City">
										</div>
									</div>
									<div class="form-group state">
										<label for="cmb-state">State</label>
										<div class="form-group-by">
											<div class="defaultSt">
												<select>
													<option value="AL" selected>CA</option>
													<option value="AK">AK</option>
													<option value="AS">AS</option>
													<option value="AZ">AZ</option>
													<option value="AI">Al</option>
													<option value="CF">CF</option>
													<option value="NE">NE</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class="form-row">
									<div class="form-group zip form-required">
										<label for="cmb-zipcode">Zip Code</label>
										<div class="form-group-by">
											<input type="text" class="input-zipcode" name="input-zipcode" value="" placeholder="Zip Code">
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="box-user-action">
							<!-- <div class="fl"><a href="#" class="red-link">My Address Book</a></div> -->
							<div class="pull-right">
								<a class="link-cancel" href="">cancel</a>
								<button type="submit" class="btn black_btn" value="">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>

			
		</div>

	</div>
	
	<?php include 'include/footer.php'; ?>

