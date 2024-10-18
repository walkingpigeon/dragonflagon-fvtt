import * as DFChatArchive from "./archive/df-chat-archive";
import * as DFAdventureLog from "./logger/df-adventure-log";
import DFAdventureLogProcessor from "./logger/DFAdventureLogProcessor";
import SETTINGS from "../../common/Settings";
SETTINGS.init('df-chat-enhance');

declare global {
	interface Application {
		_recalculateDimensions(): void;
	}
}

(<any>Application.prototype)._recalculateDimensions = function () {
	this.element[0].style.height = '';
	this.element[0].style.width = '';
	this.setPosition({});
};

Hooks.once('setup', function () {
	ChatRollPrivacy.setup();
});

Hooks.once('init', function () {
	/**
	 * Order here matters! The archive adds a button to the
	 * chat window, while the privacy changes those buttons
	 * from <a> tags to <button> tags if enabled.
	 */
	DFChatArchive.init();
	DFAdventureLog.init();

	libWrapper.register(SETTINGS.MOD_NAME, 'ChatLog.prototype._getEntryContextOptions', function (wrapped: (...args: any) => ContextMenu.Item[], ...args: any) {
		const options = wrapped(...args);
		DFChatEdit.appendChatContextMenuOptions(options);
		DFAdventureLogProcessor.appendChatContextMenuOptions(options);
		return options;
	}, 'WRAPPER');
});

Hooks.once('ready', function () {
	if (!game.modules.get('lib-wrapper')?.active) {
		console.error('Missing libWrapper module dependency');
		if (game.user.isGM)
			ui.notifications.error('DF_CHAT_LOG.Error.LibWrapperMissing'.localize());
	}
	DFAdventureLog.ready();
	DFChatEdit.ready();
});
