$(document).ready(function() {	
	$(".videoContainer").each(function () {
		var $this = $(this);
		var video = $this.find("video");
		var loading = $this.find('.loading');
		var current = $this.find('.current');
		var duration = $this.find('.duration');
		var control = $this.find('.control');
		var btnPlay = $this.find('.btnPlay');
		var bufferBar = $this.find('.bufferBar');
		var btnx1 = $this.find('.btnx1');
		var btnx2 = $this.find('.btnx2');
		var btnx3 = $this.find('.btnx3');
		var btnx05 = $this.find('.btnx05');
		var btnFS = $this.find('.btnFS');
		
		video[0].removeAttribute("controls");
		loading.fadeIn(500);
		video.on('loadedmetadata', function() {
			current.text(timeFormat(0));
			duration.text(timeFormat(video[0].duration));
			$this.append('<div class="init"></div>')
			
			updateVolume(0, 0.7);
			setTimeout(startBuffer, 150);
			$this.on('click', function() {
				$this.find('.init').remove();
				btnPlay.addClass('paused');
				$(this).unbind('click');
				video[0].play();
			});
			$this.find('.init').fadeIn(200);
		});
		var startBuffer = function() {
			var currentBuffer = video[0].buffered.end(0);
			var maxduration = video[0].duration;
			var perc = 100 * currentBuffer / maxduration;
			bufferBar.css('width', perc + '%');
			if (currentBuffer < maxduration) {
				setTimeout(startBuffer, 500);
			}
		};
		video.on('timeupdate', function() {
			var currentPos = video[0].currentTime;
			var maxduration = video[0].duration;
			var perc = 100 * currentPos / maxduration;
			$this.find('.timeBar').css('width', perc + '%');
			$this.find('.current').text(timeFormat(currentPos));
		});
		video.on('click', function() {
			playpause();
		});
		btnPlay.on('click', function() {
			playpause();
		});
		var playpause = function() {
			if (video[0].paused || video[0].ended) {
				btnPlay.addClass('paused');
				video[0].play();
			} else {
				btnPlay.removeClass('paused');
				video[0].pause();
			}
		};
		$this.find('.btnhd').on('click', function() {
			quality(this, "hd");
		});
		$this.find('.btnsd').on('click', function() {
			quality(this, "sd");
		});
		$this.find('.btnmd').on('click', function() {
			quality(this, "md");
		});
		btnFS.on('click', function() { 
		var element = $this[0];
		if(element.requestFullscreen) {
			element.requestFullscreen();
		  } else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		  } else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		  } else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		  }		
		});
		
		btnx05.on('click', function() { fastfowrd(this, 0.5); });
		btnx1.on('click', function() { fastfowrd(this, 1); });
		btnx2.on('click', function() { fastfowrd(this, 2); });
		btnx3.on('click', function() { fastfowrd(this, 3); });
		var fastfowrd = function(obj, spd) {
			video[0].playbackRate = spd;
			video[0].play();
		};	 
		var quality = function(obj, qty) {
			$this.find('.text').removeClass('selected');
			$(obj).addClass('selected');
			video[0].pause();
			$('source', 'video').attr('src', $('source', 'video').attr(qty + '-src'));
			$('video')[0].load();
			video[0].play();
		};
		$this.find('.btnStop').on('click', function() {
			btnPlay.removeClass('paused');
			updatebar($this.find('.progress').offset().left);
			video[0].pause();
		});


			$this.find('.rate').on('input', function() {
				var spdRate = $(this).val();
				video[0].playbackRate = spdRate
				$this.find('.speed').html(spdRate.toString());
			});
			$this.find('.btnCC').on('click', function() {
			$(this).toggleClass('CC');
			if (!$(this).hasClass('CC')) {
						$this.find('track')[0].mode = 'hidden';
						video[0].textTracks[0].mode = "hidden";
			} else {
			  $this.find('track')[0].mode = 'showing';
						video[0].textTracks[0].mode = "showing";
			}
		});
			
			
				
		$this.find('.sound').click(function() {
			video[0].muted = !video[0].muted;
			$(this).toggleClass('muted');
			if (video[0].muted) {
				$this.find('.volumeBar').css('width', 0);
			} else {
				$this.find('.volumeBar').css('width', video[0].volume * 100 + '%');
			}
		});
		video.on('canplay', function() {
			loading.fadeOut(100);
		});
		var completeloaded = false;
		video.on('canplaythrough', function() {
			completeloaded = true;
		});
		video.on('ended', function() {
			$this.find('.btnPlay').removeClass('paused');
			video[0].pause();
		});
		video.on('seeking', function() {
			if (!completeloaded) {
				loading.fadeIn(200);
			}
		});
		video.on('seeked', function() {});
		video.on('waiting', function() {
			loading.fadeIn(200);
		});
		var timeDrag = false;
		$this.find('.progress').on('mousedown', function(e) {
			timeDrag = true;
			updatebar(e.pageX);
		});
		$(document).on('mouseup', function(e) {
			if (timeDrag) {
				timeDrag = false;
				updatebar(e.pageX);
			}
		});
		$(document).on('mousemove', function(e) {
			if (timeDrag) {
				updatebar(e.pageX);
			}
		});
		var updatebar = function(x) {
			var progress = $this.find('.progress');
			var maxduration = video[0].duration;
			var position = x - progress.offset().left;
			var percentage = 100 * position / progress.width();
			if (percentage > 100) {
				percentage = 100;
			}
			if (percentage < 0) {
				percentage = 0;
			}
			$this.find('.timeBar').css('width', percentage + '%');
			video[0].currentTime = maxduration * percentage / 100;
		};
		var volumeDrag = false;
		$this.find('.volume').on('mousedown', function(e) {
			volumeDrag = true;
			video[0].muted = false;
			$this.find('.sound').removeClass('muted');
			updateVolume(e.pageX);
		});
		$(document).on('mouseup', function(e) {
			if (volumeDrag) {
				volumeDrag = false;
				updateVolume(e.pageX);
			}
		});
		$(document).on('mousemove', function(e) {
			if (volumeDrag) {
				updateVolume(e.pageX);
			}
		});
		var updateVolume = function(x, vol) {
			var volume = $this.find('.volume');
			var percentage;
			if (vol) {
				percentage = vol * 100;
			} else {
				var position = x - volume.offset().left;
				percentage = 100 * position / volume.width();
			}
			if (percentage > 100) {
				percentage = 100;
			}
			if (percentage < 0) {
				percentage = 0;
			}
			$this.find('.volumeBar').css('width', percentage + '%');
			video[0].volume = percentage / 100;
			if (video[0].volume == 0) {
				$this.find('.sound').removeClass('sound2').addClass('muted');
			} else if (video[0].volume > 0.5) {
				$this.find('.sound').removeClass('muted').addClass('sound2');
			} else {
				$this.find('.sound').removeClass('muted').removeClass('sound2');
			}
		};
			
		var timeFormat = function(seconds) {
			var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
			var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
			return m + ":" + s;
		};
	});
});