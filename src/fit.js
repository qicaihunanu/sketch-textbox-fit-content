var Group = require('sketch/dom').Group
var Text = require('sketch/dom').Text
var trim  = true;
export function runWithTrim(context){
	trim = true;
	run(context);
}
export function runWithoutTrim(context){
	trim = false;
	run(context);
}

function run( context ) {
	var selectedLayers = context.selection;
	var selectedCount = selectedLayers.count();

	if ( selectedCount === 0 ) {
		context.document.showMessage('No layers selected.');
	} else {
		for ( var i = 0; i < selectedCount; i++ ) {
			var layer = selectedLayers[ i ];
			checkLayer(layer);
		}
	}
}

function checkLayer( layer ) {



	if(layer.isMemberOfClass(MSTextLayer) === 1){
		fitLayer(layer)
	} else if ( layer.isMemberOfClass(MSLayerGroup) === 1  ) {
		var layers = layer.layers();
		for(var i= 0; i<layers.count(); i++){
			checkLayer(layers[i]);
		}
        Group.fromNative(layer).adjustToFit()

	}
}

function fitLayer( textLayer) {
	if(trim){
		var content = textLayer.stringValue();
		textLayer.setStringValue(content.replace(/^\s+|\s+$/g, '').trim())
	}

    

	var fontSize = textLayer.fontSize();
	var baselineOffsets = textLayer.immutableModelObject().textLayout().baselineOffsets();
	var textHeight = baselineOffsets[ baselineOffsets.length - 1 ] + fontSize / 4;
	textLayer.frame().height = textHeight;
}