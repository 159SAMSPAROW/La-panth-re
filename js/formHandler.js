/*$(function()
{	
	$("input,textarea").jqBootstrapValidation(
    {
     	preventSubmit: true,
     	submitSuccess: function($form, event)
	 	{			
			if(!$form.attr('action')) // Check form doesnt have action attribute
			{
				event.preventDefault(); // prevent default submit behaviour
			
				var processorFile = getProcessorPath($form);
				var formData = {};

				$form.find("input, textarea, option:selected").each(function(e) // Loop over form objects build data object
				{		
					var fieldData =  $(this).val();
					var fieldID =  $(this).attr('id');
				
					if($(this).is(':checkbox')) // Handle Checkboxes
					{
						fieldData = $(this).is(":checked");
					}
					else if($(this).is(':radio')) // Handle Radios
					{
						fieldData = $(this).val()+' = '+$(this).is(":checked");
					}
					else if($(this).is('option:selected')) // Handle Option Selects
					{
						fieldID = $(this).parent().attr('id');
					}
					
					formData[fieldID] = fieldData;		
				});
	
				$.ajax({
		        	url: processorFile,
		    		type: "POST",
		    		data: formData,
		    		cache: false,
		    		success: function() // Success
		 			{  
						if($form.is('[data-success-msg]')) // Show Success Message
						{
							$form.append("<div id='form-alert'><div class='alert alert-success'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+$form.attr('data-success-msg')+"</strong></div></div>");
						}
						else // Re-Direct
						{
							window.location.replace($form.attr('success-url'));
						}	
						
						$form.trigger("reset"); // Clear Form	
		 	   		},
			   		error: function() // Fail
			   		{
						if($('#form-alert').length == 0)
						{
							$form.append("<div id='form-alert'><div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+$form.attr('data-fail-msg')+"</strong></div></div>");
						}	
			   		},
		   		});
			}
         },
         filter: function() // Handle hidden form elements
		 {
			 return $(this).is(":visible");
         },
	 });
	 
	 // Get Path to processor PHP file
	 function getProcessorPath(form)
	 {
		var path = "./includes/"+form.attr('id')+".php";
		
		if(form.attr('template-path')) // Check For Template path
		{
			path = form.attr('template-path')+"/includes/"+form.attr('id')+".php";
		}
		
	 	return path
	 }
});*/
$((function(){$("input,textarea").jqBootstrapValidation({preventSubmit:!0,submitSuccess:function(t,a){if(!t.attr("action")){a.preventDefault();var e=function(t){var a="./includes/"+t.attr("id")+".php";t.attr("template-path")&&(a=t.attr("template-path")+"/includes/"+t.attr("id")+".php");return a}(t),i={};t.find("input, textarea, option:selected").each((function(t){var a=$(this).val(),e=$(this).attr("id");$(this).is(":checkbox")?a=$(this).is(":checked"):$(this).is(":radio")?a=$(this).val()+" = "+$(this).is(":checked"):$(this).is("option:selected")&&(e=$(this).parent().attr("id")),i[e]=a})),$.ajax({url:e,type:"POST",data:i,cache:!1,success:function(){t.is("[data-success-msg]")?t.append("<div id='form-alert'><div class='alert alert-success'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+t.attr("data-success-msg")+"</strong></div></div>"):window.location.replace(t.attr("success-url")),t.trigger("reset")},error:function(){0==$("#form-alert").length&&t.append("<div id='form-alert'><div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+t.attr("data-fail-msg")+"</strong></div></div>")}})}},filter:function(){return $(this).is(":visible")}})}));