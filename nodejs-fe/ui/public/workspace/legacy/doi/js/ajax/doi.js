$(document).ready(function() {

	var host = SW.hostname;
	var port = SW.port;
	//var uid = user_label.trim();
	
	var queryString = {};//{'title' : 'title'};

	var totalKeyWords = 1;
	var totalCreators = 1;
	
	//console.log('hello');
	
	$('.delete_creator').on('click',function() {
		console.log('hee');
	});
	
	$('#creator_link').click(function() {
			
			console.log('adding creator');
			
			totalCreators = totalCreators + 1;
			
			var html = '';
			html += '<div class="controls">';
			html += '<span><input class="typeahead creator" type="text" data-provide="typeahead"> </span><span> <img src="../img/cancel-off.png" class="delete_creator" style="cursor:pointer"> </span>';
			
			html += '</div>';
			$('#creator_link').before(html);
			
			$('#creator_email_link').before(html);
			
		});
	
	$('#resource_link').click(function() {
		
		console.log('adding resource');
		
		totalCreators = totalCreators + 1;
		
		/*
		var html = '';
		html += '<div class="controls">';
		html += '<span><input class="typeahead creator" type="text" data-provide="typeahead"> </span><span> <img src="../img/cancel-off.png" class="delete_creator" style="cursor:pointer"> </span>';
		
		html += '</div>';
		$('#creator_link').before(html);
		
		$('#creator_email_link').before(html);
		*/
	});


	
	/*
	$('#keyword_link').click(function() {
		
		console.log('adding keyword');
		
		totalKeyWords = totalKeyWords + 1;
		
		var html = '';
		//html += '<div class="control-group" id="addKeyword">';
		
		//html += '<label class="control-label" for="typeahead"> Keyword';
		html += '<div class="controls">';
		html += '<input class="span6 typeahead keyword" type="text" data-provide="typeahead">';
		
		html += '</div>';
		//html += '</div>';
		
		$('#keyword_link').prepend(html);
		
		
	});
	*/
	
	
	$('#submit_doi').click(function() {

		var url = 'http://' + host + ':' + port + '/doi_send/' + 'jamroz';

		console.log('input title ---> ' + $('#title').val());
		
		console.log('submit_doi to ' + url);

		queryString['dataset_type'] = $('#title').val();
		queryString['title'] = $('#title').val();
		queryString['creators'] = $('#creators').val();
		queryString['creators_email'] = $('#creators_email').val();
		queryString['related_resources'] = $('#related_resources').val();
		queryString['product_nos'] = $('#product_nos').val();
		queryString['contract_nos'] = $('#contract_nos').val();
		queryString['other_identifying_numbers'] = $('#other_identifying_numbers').val();
		queryString['availability'] = $('#availability').val();
		queryString['contributor_organizations'] = $('#contributor_organizations').val();
		queryString['publication_date'] = $('#publication_date').val();
		queryString['language'] = $('#language').val();
		queryString['country'] = $('#country').val();
		queryString['sponsor_org'] = $('#sponsor_org').val();
		queryString['keywords'] = $('#keywords').val();
		queryString['description'] = $('#description').val();
		queryString['site_url'] = $('#site_url').val();
		queryString['doi'] = $('#doi').val();
		queryString['file_extension'] = $('#file_extension').val();
		
		/*
		dataset_type = models.CharField(max_length=50, default="RecordType")
        title = models.CharField(max_length=200)
        creators = models.CharField(max_length=1024)
        creators_email = models.CharField(max_length=1024)
        related_resources = models.CharField(max_length=1024, default="", blank=True)
        product_nos = models.CharField(max_length=200, default="", blank=True)
        contract_nos = models.CharField(max_length=200, default="", blank=True)
        other_identifying_numbers = models.CharField(max_length=200, default="", blank=True)
        availability = models.CharField(max_length=2, default="", blank=True)
        contributor_organizations = models.CharField(max_length=200, default="", blank=True)
        publication_date = models.DateField()
        language = models.CharField(max_length=20, default="", blank=True)
        country = models.CharField(max_length=20, default="", blank=True)
        sponsor_org = models.CharField(max_length=200, default="", blank=True)
        keywords = models.CharField(max_length=400, default="", blank=True)
        description = models.TextField()
        site_url = models.URLField(default="http://olcf.ornl.gov/")
        doi = models.URLField(default="", blank=True)
        file_extension = models.TextField(max_length=10, default="", blank=True)
		*/
		
		$.ajax({
			type: "POST",
			url: url,
			//dataType: JSON,
			data: queryString,
			success: function(data) {
				
				
				console.log('success');
				
				
				
				
			},
			error: function() {
				console.log('error in getting group info');
			}
		
			
		});
	});
	
	
});