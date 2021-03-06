var config = require('../nightwatch.conf.js');
var util = require('../page-objects/utils/util.js');
var fs = require('fs');
var path = require('path');

var sourcedata_filename = 'dataTrento';
var JSONdata = fs.readFileSync('tmp/'+sourcedata_filename+'.json', { 'encoding': 'utf8'});
var data = JSON.parse(JSONdata)[0];
var download_folder = "downloads/";

var mappingTrento = require('../page-objects/utils/mappingTrento.json');
var languages = ["Italian"];

var time_pause = 1000;
var enable_screenshot = false;

module.exports = {
	'@tags': ['dataTrento'],

	'Fill data': function(browser) {

		var editor = browser.page.Editor();
		var rdfdata = browser.page.RDFData();

		for (var i=0; i < languages.length; i++) {

			for (var j=0; j < util.getLengthData(data, languages[i]); j++) {

			/*Fill the public service information*/
			editor.navigate()
				.waitForElementVisible('body')
				.set_ps_identifier(util.getPublicServiceId(data, languages[i], j))
				.set_ps_name(util.getPublicServiceName(data, languages[i], j))
				.set_ps_name_lang(languages[i])
				.set_ps_description(util.getPublicServiceDescription(data, languages[i], j))
				.set_ps_description_lang(languages[i])
				.set_ps_language(languages[i])
				.set_ps_spatial(util.getSpatialCodeByMapping(data, mappingTrento.mappings[0].SpatialCode[0], languages[i], j))
				.set_ps_status(util.getStatusByMapping(data, mappingTrento.mappings[1].Status[0], languages[i], j));
			
			var keywords = util.getPublicServiceKeywords(data, languages[i], j );
			for (var k = 0; k < keywords.length; k++) {
			    editor
			    	.set_ps_keyword(keywords[k], k+1)
			    	.set_ps_keyword_lang(languages[i], k+1)
			    	.expand_ps_keyword();
			}
			var sector = util.getPublicServiceSector(data, languages[i], j );
			for (var k = 0; k < sector.length; k++) {
			    editor
			    	.set_ps_sector(sector[k], k+1)
			    	.expand_ps_sector();
			}
			var type = util.getPublicServiceType(data, languages[i], j );
			for (var k = 0; k < type.length; k++) {
			    editor
			    	.set_ps_type(type[k], k+1)
			    	.expand_ps_type();
			}
			var thematicarea = util.getPublicServiceThematicArea(data, languages[i], j );
			for (var k = 0; k < thematicarea.length; k++) {
			    editor
			    	.set_ps_thematicarea(thematicarea[k], k+1)
			    	.expand_ps_thematicarea();
			}
			editor
				.set_ps_pt_years(util.getProcessingTimeYear(data, languages[i], j))
				.set_ps_pt_months(util.getProcessingTimeMonth(data, languages[i], j))
				.set_ps_pt_days(util.getProcessingTimeDay(data, languages[i], j))
				.set_ps_pt_hours(util.getProcessingTimeHour(data, languages[i], j))
				.set_ps_pt_minutes(util.getProcessingTimeMinute(data, languages[i], j));
			
			var requires = util.getRequires(data,languages[i],j);
			for (var k = 0; k < requires.length; k++) {
			    editor
			    	.set_ps_requires(requires[k], k+1)
			    	.expand_ps_requires();
			}
			
			var related = util.getRelated(data,languages[i],j);
			for (var k = 0; k < related.length; k++) {
			    editor
			    	.set_ps_related(related[k], k+1)
			    	.expand_ps_related();
			}
			
			/*Fill Public Organisation */
			editor
				.set_ca_identifier(util.getCompotentAuthorityIdentifier(data, languages[i], j))
				.set_ca_name(util.getCompetentAuthorityName(data, languages[i], util.getCompotentAuthorityIdentifier(data, languages[i], j)))
				.set_ca_name_lang(languages[i])
				.set_ca_preferredlabel(util.getCompetentAuthorityName(data, languages[i], util.getCompotentAuthorityIdentifier(data, languages[i], j)))
				.set_ca_preferredlabel_lang(languages[i])
				.set_ca_spatial(util.getSpatialCodeByMapping(data, mappingTrento.mappings[0].SpatialCode[0], languages[i], j))
				.set_ca_hasaddress(util.getCompetentAuthorityHasAddress(data, languages[i], util.getCompotentAuthorityIdentifier(data, languages[i], j)));
			
			/*Fill Business Event*/
			var businessevents = util.getBusinessEvents(data,languages[i],j);
			for (var k = 0; k < businessevents.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				businessevent = util.getBusinessEventByID(data, languages[i], businessevents[k]);
				editor
					.be_expand(expand)
					.set_be_identifier(businessevent.BusinessEvent_id,k+1)
					.set_be_name(businessevent.BusinessEvent_name,k+1)
					.set_be_name_lang(languages[i],k+1)
					.set_be_description(businessevent.BusinessEvent_description,k+1)
					.set_be_description_lang(languages[i],k+1)
					.set_be_type(businessevent.BusinessEvent_type,k+1);	
			}
			/*Fill Life Event*/
			var lifeevents = util.getLifeEvents(data,languages[i],j);
			for (var k = 0; k < lifeevents.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				lifeevent = util.getLifeEventByID(data, languages[i], lifeevents[k]);
				editor
					.le_expand(expand)
					.set_le_identifier(lifeevent.LifeEvent_id,k+1)
					.set_le_name(lifeevent.LifeEvent_name,k+1)
					.set_le_name_lang(languages[i],k+1)
					.set_le_description(lifeevent.LifeEvent_description,k+1)
					.set_le_description_lang(languages[i],k+1)
					.set_le_type(lifeevent.LifeEvent_type,k+1);	
			}
			
			
			
			/*Fill Criterion Requirement*/
			var criterionrequirements = util.getHasCriterions(data,languages[i],j);
			for (var k = 0; k < criterionrequirements.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				criterionrequirement = util.getCriterionRequirementByID(data, languages[i], criterionrequirements[k]);
				editor
					.cr_expand(expand)
					.set_cr_identifier(criterionrequirement.CriterionRequirement_id,k+1)
					.set_cr_name(criterionrequirement.CriterionRequirement_name,k+1)
					.set_cr_name_lang(languages[i],k+1);
			}
			
			/*Fill Evidence*/
			var hasInputs = util.getHasInputs(data,languages[i],j);
			for (var k = 0; k < hasInputs.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				evidence = util.getHasInputByID(data, languages[i], hasInputs[k]);
				editor
					.ev_expand(expand)
					.set_ev_identifier(evidence.Evidence_id,k+1)
					.set_ev_name(evidence.Evidence_name,k+1)
					.set_ev_name_lang(languages[i],k+1);	
			}
			
			/*Fill all Legal Resources */
			var legalResources = util.getLegalResources(data,languages[i],j);
			for (var k = 0; k < legalResources.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				legalresource = util.getLegalResourceByID(data, languages[i], legalResources[k]);
				editor
					.lr_expand(expand)
					.set_lr_identifier(legalresource.LegalResource_id,k+1)
					.set_lr_description(legalresource.LegalResource_description,k+1)
					.set_lr_description_lang(languages[i],k+1);
			}

//			/*Fill Output*/
			var outputs = util.getOutputs(data,languages[i],j);
			for (var k = 0; k < outputs.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				output = util.getOutputByID(data, languages[i], outputs[k]);
				editor
					.ou_expand(expand)
					.set_ou_identifier(output.Output_id,k+1)
					.set_ou_name(output.Output_name,k+1)
					.set_ou_name_lang(languages[i],k+1)
					.set_ou_type(output.Output_type,k+1);	
			}
			
//			/*Fill the Contact Point */			
			var contactpoints = util.getContactPoints(data,languages[i],j);
			for (var k = 0; k < contactpoints.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				contactpoint = util.getContactPointsByID(data, languages[i], contactpoints[k]);
				editor
					.hcp_expand(expand)
					.set_hcp_identifier(contactpoint.ContactPoint_id,k+1)
					.set_hcp_hasemail(contactpoint.ContactPoint_email,k+1);
//					.set_hcp_hastelephone(contactpoint.ContactPoint_telephone,k+1)
//					.set_hcp_faxnumber(contactpoint.ContactPoint_faxnumber,k+1);
				
				
				var telephones = util.getContactPointTelephones(contactpoint);
				for (var t = 0; t < telephones.length; t++) {
				    editor
				    	.set_hcp_hastelephone(telephones[t], k+1, t+1)
				    	.expand_hcp_telephone(t+1);
				}
				var faxes = util.getContactPointFaxes(contactpoint);
				for (var t = 0; t < faxes.length; t++) {
				    editor
				    	.set_hcp_hasfax(faxes[t], k+1, t+1)
				    	.expand_hcp_fax(t+1);
				}
			}

//			/*Fill the Channel*/
			var Channels = util.getChannels(data,languages[i],j);
			for (var k = 0; k < Channels.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				channel = util.getChannelByID(data, languages[i], Channels[k]);
				editor
					.ch_expand(expand)
					.set_ch_identifier(channel.Channel_id,k+1)
					.set_ch_description(channel.Channel_description,k+1)
					.set_ch_description_lang(languages[i],k+1);
			}	
	
			/*Fill the Cost */	
			var Costs = util.getCosts(data,languages[i],j);
			for (var k = 0; k < Costs.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				cost = util.getCostByID(data, languages[i], Costs[k]);
				editor
					.hc_expand(expand)
					.set_hc_identifier(cost.Cost_id,k+1)
//					.set_hc_value(cost.Cost_value,k+1)
//					.set_hc_currency(cost.Cost_currency,k+1)
					.set_hc_description(cost.Cost_description,k+1)
					.set_hc_description_lang(languages[i],k+1);
			}
			/*Fill the Public Service Dataset */	
			var Datasets = util.getDatasets(data,languages[i],j);
			for (var k = 0; k < Datasets.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				dataset = util.getDatasetByID(data, languages[i], Datasets[k]);
				editor
					.psd_expand(expand)
					.set_psd_identifier(dataset.PublicServiceDataset_id,k+1)
					.set_psd_name(dataset.PublicServiceDataset_name,k+1)
					.set_psd_name_lang(languages[i],k+1)
					.set_psd_landingPage(dataset.PublicServiceDataset_landingPage,k+1)
					.set_psd_landingPage_lang(languages[i],k+1);
			}
			
			/*Fill the Concept */		
			var Concepts = util.getConcepts(data,languages[i],j);
			for (var k = 0; k < Concepts.length; k++) {
				if (k == 0) {
					expand = 1
				} else {
					expand = k
				}
				concept = util.getConceptByID(data, languages[i], Concepts[k]);
				editor
					.co_expand(expand)
					.set_co_identifier(concept.Concept_id,k+1)
					.set_co_description(concept.Concept_description,k+1)
					.set_co_description_lang(languages[i],k+1);
			}

			browser
			.pause(time_pause*10);
			
			/*Download the result*/
			editor.select();

			if(enable_screenshot){
				browser
					.saveScreenshot(config.imgpath(browser) + 'editor.png');
			}

			rdfdata
				.select();

			if(enable_screenshot){
				browser
					.pause(time_pause)
					.saveScreenshot(config.imgpath(browser) + 'rdfdata.png');
			}

			browser
				.pause(time_pause);

			rdfdata
				.download();

			browser
				.pause(time_pause*4);

			if(enable_screenshot){
				browser
					.saveScreenshot(config.imgpath(browser) + 'rdfdata-download.png');
			}

			};
			
		}	

		browser
			.end();	

	}
	
};
