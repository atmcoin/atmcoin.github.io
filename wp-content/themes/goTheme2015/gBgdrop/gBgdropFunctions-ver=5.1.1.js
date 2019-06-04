/*
 * @Author: Marissa Solomon@gBg!
 * December 2014
 *
 */
 
jQuery(function($) {
	$('.gBgdrop-selectBox').click(function() {
		$theID = $(this).attr('id');
		$remove = 'selectBox';
		$formID = getID($theID, $remove);
		$theList = "#listwrapper".concat($formID);
		
		$($theList).slideToggle('2000', 'swing');
	})
	
	$('.hideBox .gBgdrop-selectBox').click(function() {
		$(this).hide();
	});
	
	$('.gBgdrop-list-wrapper div').click(function() {
		$theID = $(this).attr('class').split(" ")[0];
		$remove = 'item';
		$formID = getID($theID, $remove);
		$theVal = $(this).text();
		
		$theField = '#field'.concat($formID);
		$newField = $theField.concat(' .gBgdrop-wrapper');
		$($newField).val($theVal);
		
		$changeText = '#selectBox'.concat($formID);
		$($changeText).text($theVal);
		
		$theList = "#listwrapper".concat($formID);
		$($theList).slideToggle('2000', 'swing');
		
		$theBox = '#selectBox'.concat($formID);
		$($theBox).show();
		
	});
});

function getID($name, $rep) {
	$findS = $rep;
	$replaceWith = '';
	$newID = $name.replace($findS, $replaceWith);
	return $newID;
}