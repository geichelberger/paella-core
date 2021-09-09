import { DomClass, createElementWithHtmlText } from 'paella-core/js/core/dom';

import ProgressIndicator from 'paella-core/js/core/ProgressIndicator';
import { loadPluginsOfType } from 'paella-core/js/core/Plugin';
import { addButtonPlugin } from 'paella-core/js/core/ButtonPlugin';

import 'paella-core/styles/PlaybackBar.css';

export default class PlaybackBar extends DomClass {
	constructor(player,parent) {
		const attributes = {
			"class": "playback-bar"
		};
		super(player, { attributes, parent });
		
		this._progressIndicator = new ProgressIndicator(player, this.element);
		this._buttonPluginsLeft = createElementWithHtmlText(
			`<div class="button-plugins left-side"></div>`, this.element);
		this._buttonPluginsRight = createElementWithHtmlText(
			`<div class="button-plugins right-side"></div>`, this.element);
	}
	
	async load() {		
		this._frameList = this.player.videoManifest;
		
		this.player.log.debug("Loading button plugins");
		loadPluginsOfType(this.player,"button",(plugin) => {
			this.player.log.debug(` Button plugin: ${ plugin.name }`);
			if (plugin.side === "left") {
				addButtonPlugin(plugin, this.buttonPluginsLeft);
			}
			else if (plugin.side === "right") {
				addButtonPlugin(plugin, this.buttonPluginsRight);
			}
		}, async plugin => {
			if (plugin.parentContainer === "playbackBar") {
				return await plugin.isEnabled();
			}
			else {
				return false;
			}
		});
		
	}
	
	hideUserInterface() {
		this.player.log.debug("Hide playback bar user interface");
		this.hide();
	}
	
	showUserInterface() {
		this.show();
	}
	
	get buttonPluginsRight() {
		return this._buttonPluginsRight;
	}
	
	get buttonPluginsLeft() {
		return this._buttonPluginsLeft;
	}
	
	get progressIndicator() {
		return this._progressIndicator;
	}
	
	onResize() {
		this.progressIndicator.onResize();
	}
}