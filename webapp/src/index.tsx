// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from 'manifest';
import type {Store, Action} from 'redux';

import type {GlobalState} from '@mattermost/types/store';
import type {Post} from '@mattermost/types/posts';

import type {PluginRegistry} from 'types/mattermost-webapp';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/

        // Register the "Fake Reply" button in post dropdown menu
        registry.registerPostDropdownMenuAction(
            'Fake Reply',
            (postId: string) => {
                const state = store.getState();

                // Get post information
                const post = state.entities.posts.posts[postId];
                if (!post) {
                    console.error('Post not found:', postId);
                    return;
                }

                // Get user information for @mention
                const user = state.entities.users.profiles[post.user_id];
                if (!user) {
                    console.error('User not found:', post.user_id);
                    return;
                }

                // Get team information for building permalink
                const currentTeamId = state.entities.teams.currentTeamId;
                const team = state.entities.teams.teams[currentTeamId];
                if (!team) {
                    console.error('Team not found:', currentTeamId);
                    return;
                }

                // Build permalink URL
                const permalink = `/${team.name}/pl/${postId}`;
                const fullUrl = window.location.origin + permalink;

                // Build message text with @mention and link
                const messageText = `@${user.username} ${fullUrl}\n`;

                // Get current channel and draft
                const currentChannelId = state.entities.channels.currentChannelId;

                // Get existing draft from storage
                const storage = (state as any).storage?.storage || {};
                const draftKey = `draft_${currentChannelId}`;
                const existingDraft = storage[draftKey] || {};
                const existingMessage = existingDraft.message || '';

                // Append new text to existing draft
                const newMessage = existingMessage ? `${existingMessage}\n${messageText}` : messageText;

                // Create updated draft object
                const updatedDraft = {
                    message: newMessage,
                    channelId: currentChannelId,
                    fileInfos: existingDraft.fileInfos || [],
                    uploadsInProgress: existingDraft.uploadsInProgress || [],
                    metadata: existingDraft.metadata || {},
                };

                // Dispatch updateDraft action
                // Note: This requires importing the action from mattermost-redux
                // For now, we'll use a direct state manipulation approach
                // In production, you should import and use the proper action

                // Alternative approach: Use execCommand to insert text
                // This is more reliable for immediate insertion
                const textbox = document.querySelector('#post_textbox') as HTMLTextAreaElement;
                if (textbox) {
                    textbox.focus();
                    const currentValue = textbox.value;
                    const newValue = currentValue ? `${currentValue}\n${messageText}` : messageText;

                    // Create and dispatch input event to update the textbox
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype,
                        'value'
                    )?.set;

                    if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(textbox, newValue);
                        const event = new Event('input', { bubbles: true });
                        textbox.dispatchEvent(event);
                    }
                }
            },
            (postId: string) => {
                // Filter function - show button for all posts
                return true;
            }
        );
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void;
    }
}

window.registerPlugin(manifest.id, new Plugin());
