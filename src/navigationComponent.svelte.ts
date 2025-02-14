import { type Moment } from "moment";
import { Component, TFile } from "obsidian";
import { type IGranularity } from "obsidian-daily-notes-interface";
import { searchAnnotatedLinks, getPropertyLinks } from "./annotatedLink";
import { FileCreationModal } from "./fileCreationModal";
import type NavLinkHeader from "./main";
import {
	NavigationLinkState,
	type PeriodicNoteLinkStates,
} from "./navigationLinkState";
import { createPeriodicNote } from "./periodicNotes";
import { NavLinkHeaderError } from "./utils";
import { mount, unmount } from "svelte";
import Navigation from "./ui/Navigation.svelte";
import type { NavLinkHeaderSettings } from "./settings";

/**
 * Navigation component to add the navigation links to.
 */
export class NavigationComponent extends Component {
	private navigation?: ReturnType<typeof Navigation>;
	private navigationProps: {
		periodicNoteLinks: PeriodicNoteLinkStates | undefined;
		annotatedLinksPromise: Promise<NavigationLinkState[]> | undefined;
		displayPlaceholder: boolean;
		settings: NavLinkHeaderSettings;
	} = $state() as {
		periodicNoteLinks: PeriodicNoteLinkStates | undefined;
		annotatedLinksPromise: Promise<NavigationLinkState[]> | undefined;
		displayPlaceholder: boolean;
		settings: NavLinkHeaderSettings;
	};
	private currentFilePath?: string;
	private loaded: boolean = false;

	/**
	 * Creates a new navigation component.
	 * @param plugin The plugin instance.
	 * @param containerEl The container element to add the navigation links.
	 */
	constructor(private plugin: NavLinkHeader, private containerEl: Element) {
		super();
	}

	/**
	 * Initializes the navigation component.
	 */
	public onload(): void {
		this.navigationProps = {
			periodicNoteLinks: undefined,
			annotatedLinksPromise: undefined,
			displayPlaceholder: false,
			settings: this.plugin.settings!,
		};
		this.navigation = mount(Navigation, {
			target: this.containerEl,
			props: this.navigationProps,
		});
		this.loaded = true;
	}

	/**
	 * Updates the navigation component with the specified file.
	 * @param file The file object currently opened in the parent component.
	 * @param hoverParent The parent component to add the hover popover when
	 *    the link in this component is hovered.
	 * @param forced If `true`, the navigation component is always updated.
	 *    If `false`, the navigation component will not be updated if the file path
	 *    has not changed since the last update.
	 */
	public update(file: TFile, hoverParent: Component, forced: boolean): void {
		if (!this.loaded) {
			return;
		}

		// Prevents unnecessary updates.
		if (!forced && this.currentFilePath === file.path) {
			return;
		}
		this.currentFilePath = file.path;

		this.navigationProps.periodicNoteLinks = this.getPeriodicNoteLinkStates(
			file,
			hoverParent
		);
		this.navigationProps.annotatedLinksPromise =
			this.getAnnotatedLinkStates(file, hoverParent);
		this.navigationProps.displayPlaceholder =
			this.plugin.settings!.displayPlaceholder;
<<<<<<< HEAD
		this.navigationProps.settings = this.plugin.settings!;
=======

		const filePath = file.path;
		const newLinks = new LinkContainer(this.plugin);
		const clickHandler: LinkEventHandler = (target, e) => {
			void this.plugin.app.workspace.openLinkText(
				target.destinationPath,
				filePath,
				e.ctrlKey || e.button === 1
			);
		};
		const mouseOverHandler: LinkEventHandler = (target, e) => {
			this.plugin.app.workspace.trigger("hover-link", {
				event: e,
				source: "nav-link-header",
				hoverParent,
				targetEl: e.target,
				linktext: target.destinationPath,
				sourcePath: filePath,
			});
		};

		// Property links
		if (this.plugin.settings!.propertyMappings.length > 0) {
			this.constructPropertyLinkStates(
				file,
				clickHandler,
				mouseOverHandler
			).forEach((link) => {
				newLinks.addLink(link);
			});
		}

		// Periodic note links
		if (this.plugin.periodicNotesActive) {
			const periodicNoteLinkState = this.constructPeriodicNoteLinkState(
				file,
				clickHandler,
				mouseOverHandler
			);
			if (periodicNoteLinkState) {
				newLinks.addLink(periodicNoteLinkState);
			}
		}

		// Three-way property links
		if (
			this.plugin.settings!.previousLinkProperty ||
			this.plugin.settings!.nextLinkProperty ||
			this.plugin.settings!.parentLinkProperty
		) {
			const threeWayPropertyLink =
				this.constructThreeWayPropertyLinkState(
					file,
					clickHandler,
					mouseOverHandler
				);
			if (threeWayPropertyLink) {
				newLinks.addLink(threeWayPropertyLink);
			}
		}

		// Folder links
		if (this.plugin.settings!.folderLinksSettingsArray.length > 0) {
			this.constructFolderLinkStates(
				file,
				clickHandler,
				mouseOverHandler
			).forEach((link) => {
				newLinks.addLink(link);
			});
		}

		if (fileChanged) {
			// If the file has changed, update the navigation as soon as possible.
			this.navigationProps.links = [...newLinks.getLinks()];
		}

		// Annotated links
		if (this.plugin.settings!.annotationStrings.length > 0) {
			const generator = this.constructAnnotatedLinkStates(
				file,
				clickHandler,
				mouseOverHandler
			);
			for await (const link of generator) {
				if (!this.loaded) {
					return; // Handles the async gap.
				}
				newLinks.addLink(link);
				if (fileChanged) {
					// If the file has changed, update the navigation as soon as possible.
					this.navigationProps.links = [...newLinks.getLinks()];
				}
			}
		}

		if (!fileChanged) {
			// If the file has not changed, update the navigation after all links are added.
			// This is to prevent flickering.
			this.navigationProps.links = [...newLinks.getLinks()];
		}

		this.navigationProps.isLoading = false;
>>>>>>> e2e2afd (Add folder link feature)
	}

	private async getAnnotatedLinkStates(
		file: TFile,
<<<<<<< HEAD
		hoverParent: Component
	): Promise<NavigationLinkState[]> {
		if (!this.plugin.settings!.annotatedLinksEnabled) {
			return [];
		}

		const filePath = file.path;
		const annotationStrings =
			this.plugin.settings!.annotationStrings.split(",");
		const propertyNames = this.plugin.settings!.propertyMappings.map(
			(mapping) => mapping.property
=======
		clickHandler: LinkEventHandler,
		mouseOverHandler: LinkEventHandler
	): PrefixedLinkState[] {
		const result: PrefixedLinkState[] = [];

		const propertyLinks = getPropertyLinks(this.plugin, file);
		for (const link of propertyLinks) {
			result.push(
				new PrefixedLinkState({
					prefix: link.prefix,
					link: new NavigationLinkState({
						destinationPath: link.destinationPath,
						displayText: this.getDisplayText(
							link.destinationPath,
							link.displayText
						),
						resolved: true,
						clickHandler,
						mouseOverHandler,
					}),
				})
			);
		}

		return result;
	}

	/**
	 * Constructs the periodic note link state for the specified file.
	 * @param file The file to construct the periodic note link states for.
	 * @param clickHandler The default click handler for the links.
	 * @param mouseOverHandler The default mouse over handler for the links.
	 * @returns The periodic note link state.
	 */
	private constructPeriodicNoteLinkState(
		file: TFile,
		clickHandler: LinkEventHandler,
		mouseOverHandler: LinkEventHandler
	): ThreeWayLinkState | undefined {
		const periodicNoteLinks =
			this.plugin.periodicNotesManager!.searchAdjacentNotes(file);
		if (!periodicNoteLinks.currentGranularity) {
			return undefined;
		}

		const previous: {
			link?: NavigationLinkState;
			hidden: boolean;
		} = { link: undefined, hidden: true };
		const next: {
			link?: NavigationLinkState;
			hidden: boolean;
		} = { link: undefined, hidden: true };
		const parent: {
			link?: NavigationLinkState;
			hidden: boolean;
		} = { link: undefined, hidden: true };

		// Previous and next links
		if (
			getPrevNextLinkEnabledSetting(
				this.plugin.settings!,
				periodicNoteLinks.currentGranularity
			)
		) {
			previous.hidden = false;
			next.hidden = false;

			if (periodicNoteLinks.previousPath) {
				previous.link = new NavigationLinkState({
					destinationPath: periodicNoteLinks.previousPath,
					displayText: this.getDisplayText(
						periodicNoteLinks.previousPath
					),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				});
			}
			if (periodicNoteLinks.nextPath) {
				next.link = new NavigationLinkState({
					destinationPath: periodicNoteLinks.nextPath,
					displayText: this.getDisplayText(
						periodicNoteLinks.nextPath
					),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				});
			}
		}

		// Parent link
		const parentGranularity = getParentLinkGranularitySetting(
			this.plugin.settings!,
			periodicNoteLinks.currentGranularity
>>>>>>> e2e2afd (Add folder link feature)
		);

<<<<<<< HEAD
		// If no annotation strings are specified, return an empty array
		if (annotationStrings.length + propertyNames.length === 0) {
			return [];
		}

		if (!this.loaded) {
			throw new NavLinkHeaderError(
				"The navigation component is not loaded."
			);
		}

		const [annotatedLinks, propertyLinks] = await Promise.all([
			searchAnnotatedLinks(
				this.plugin.app,
				annotationStrings,
				this.plugin.settings!.allowSpaceAfterAnnotationString,
				file
			),
			getPropertyLinks(
				this.plugin.app,
				propertyNames,
				file,
				this.plugin.settings?.usePropertyAsDisplayName
					? this.plugin.settings?.displayPropertyName
					: undefined
			),
		]);

		// Get property values for all links if needed
		const propertyValuesForAnnotatedLinks = this.plugin.settings
			?.usePropertyAsDisplayName
			? annotatedLinks.map((link) => {
					const linkedFile =
						this.plugin.app.metadataCache.getFirstLinkpathDest(
							link.destinationPath,
							file.path
						);
					if (!linkedFile) return undefined;

					const linkedFileCache =
						this.plugin.app.metadataCache.getFileCache(linkedFile);
					if (
						linkedFileCache?.frontmatter &&
						this.plugin.settings?.displayPropertyName
					) {
						const result = linkedFileCache.frontmatter[
							this.plugin.settings.displayPropertyName
						] as unknown;
						if (typeof result === "string") {
							return result;
=======
			if (periodicNoteLinks.parentPath) {
				if (!periodicNoteLinks.parentDate) {
					parent.link = new NavigationLinkState({
						destinationPath: periodicNoteLinks.parentPath,
						displayText: this.getDisplayText(
							periodicNoteLinks.parentPath
						),
						resolved: true,
						clickHandler,
						mouseOverHandler,
					});
				} else {
					// Make unresolved link.
					const clickHandlerForUnresolvedLinks: LinkEventHandler = (
						target,
						e
					) => {
						if (this.plugin.settings!.confirmFileCreation) {
							new FileCreationModal(
								this.plugin,
								getTitleFromPath(target.destinationPath),
								() => {
									void createPeriodicNote(
										periodicNoteLinks.parentGranularity!,
										periodicNoteLinks.parentDate!
									);
								}
							).open();
>>>>>>> e2e2afd (Add folder link feature)
						} else {
							return undefined;
						}
					}
					return undefined;
			  })
			: annotatedLinks.map(() => undefined);

		// Combine all links and convert to NavigationLinkState
		const allLinks = [
			...annotatedLinks.map((link, index) => ({
				...link,
				isPropertyLink: false,
				propertyValue: propertyValuesForAnnotatedLinks[index],
			})),
			...propertyLinks.map((link) => ({
				...link,
				isPropertyLink: true,
			})),
		];

		// Filter duplicates if needed
		const seenPaths = new Set<string>();
		const uniqueLinks = this.plugin.settings?.filterDuplicateNotes
			? allLinks.filter((link) => {
					if (seenPaths.has(link.destinationPath)) {
						return false;
					}
					seenPaths.add(link.destinationPath);
					return true;
			  })
			: allLinks;

<<<<<<< HEAD
		// Convert to NavigationLinkState
		const linkStates = uniqueLinks.map(
			(link) =>
				new NavigationLinkState({
					enabled: true,
					destinationPath: link.destinationPath,
					fileExists: true,
					annotation: link.annotation,
					isPropertyLink: link.isPropertyLink,
					propertyValue: link.propertyValue,
					clickHandler: (target, e) => {
						void this.plugin.app.workspace.openLinkText(
							target.destinationPath!,
							filePath,
							e.ctrlKey
						);
					},
					mouseOverHandler: (target, e) => {
						this.plugin.app.workspace.trigger("hover-link", {
							event: e,
							source: "nav-link-header",
							hoverParent,
							targetEl: e.target,
							linktext: target.destinationPath,
							sourcePath: filePath,
						});
					},
				})
		);

		// Sort the links
		linkStates.sort((a, b) => {
			// First, sort by whether it is a property link
			if (a.isPropertyLink !== b.isPropertyLink) {
				return a.isPropertyLink ? 1 : -1;
=======
	/**
	 * Constructs the three-way property link state for the specified file.
	 * @param file The file to construct the three-way property link states for.
	 * @param clickHandler The click handler for the links.
	 * @param mouseOverHandler The mouse over handler for the links.
	 * @returns The three-way property link state.
	 */
	private constructThreeWayPropertyLinkState(
		file: TFile,
		clickHandler: LinkEventHandler,
		mouseOverHandler: LinkEventHandler
	): ThreeWayLinkState | undefined {
		const threeWayPropertyLink = getThreeWayPropertyLink(this.plugin, file);
		if (
			!threeWayPropertyLink.previous &&
			!threeWayPropertyLink.next &&
			!threeWayPropertyLink.parent
		) {
			return undefined;
		}

		const previous: {
			link?: NavigationLinkState;
			hidden: boolean;
		} = { link: undefined, hidden: true };
		const next: {
			link?: NavigationLinkState;
			hidden: boolean;
		} = { link: undefined, hidden: true };
		const parent: {
			link?: NavigationLinkState;
			hidden: boolean;
		} = { link: undefined, hidden: true };

		if (this.plugin.settings!.previousLinkProperty) {
			previous.hidden = false;
			if (threeWayPropertyLink.previous) {
				previous.link = new NavigationLinkState({
					destinationPath:
						threeWayPropertyLink.previous.destinationPath,
					displayText: this.getDisplayText(
						threeWayPropertyLink.previous.destinationPath,
						threeWayPropertyLink.previous.displayText
					),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				});
			}
		}

		if (this.plugin.settings!.nextLinkProperty) {
			next.hidden = false;
			if (threeWayPropertyLink.next) {
				next.link = new NavigationLinkState({
					destinationPath: threeWayPropertyLink.next.destinationPath,
					displayText: this.getDisplayText(
						threeWayPropertyLink.next.destinationPath,
						threeWayPropertyLink.next.displayText
					),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				});
			}
		}

		if (this.plugin.settings!.parentLinkProperty) {
			parent.hidden = false;
			if (threeWayPropertyLink.parent) {
				parent.link = new NavigationLinkState({
					destinationPath:
						threeWayPropertyLink.parent.destinationPath,
					displayText: this.getDisplayText(
						threeWayPropertyLink.parent.destinationPath,
						threeWayPropertyLink.parent.displayText
					),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				});
			}
		}

		return new ThreeWayLinkState({
			type: "property",
			previous: previous,
			next: next,
			parent: parent,
		});
	}

	/**
	 * Constructs the folder link states for the specified file.
	 * @param file The file to construct the folder link states for.
	 * @param clickHandler The click handler for the links.
	 * @param mouseOverHandler The mouse over handler for the links.
	 * @returns The folder link states.
	 */
	private constructFolderLinkStates(
		file: TFile,
		clickHandler: LinkEventHandler,
		mouseOverHandler: LinkEventHandler
	): ThreeWayLinkState[] {
		const result: ThreeWayLinkState[] = [];

		for (let i = 0; i < this.plugin.folderLinksManager.length; i++) {
			const manager = this.plugin.folderLinksManager[i];
			const files = manager.getAdjacentFiles(file);
			if (!files.currentFileIncluded) {
				continue;
			}

			const previous: {
				link?: NavigationLinkState;
				hidden: boolean;
			} = { link: undefined, hidden: false };
			const next: {
				link?: NavigationLinkState;
				hidden: boolean;
			} = { link: undefined, hidden: false };
			const parent: {
				link?: NavigationLinkState;
				hidden: boolean;
			} = { link: undefined, hidden: true };

			if (files.previous) {
				previous.link = new NavigationLinkState({
					destinationPath: files.previous,
					displayText: this.getDisplayText(files.previous),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				});
			}

			if (files.next) {
				next.link = new NavigationLinkState({
					destinationPath: files.next,
					displayText: this.getDisplayText(files.next),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				});
			}

			if (this.plugin.settings!.folderLinksSettingsArray[i].parentPath) {
				parent.hidden = false;
				if (files.parent) {
					parent.link = new NavigationLinkState({
						destinationPath: files.parent,
						displayText: this.getDisplayText(files.parent),
						resolved: true,
						clickHandler,
						mouseOverHandler,
					});
				}
			}

			result.push(
				new ThreeWayLinkState({
					type: "folder",
					index: i,
					previous: previous,
					next: next,
					parent: parent,
				})
			);
		}

		return result;
	}

	/**
	 * Constructs the annotated link states for the specified file.
	 * @param file The file to construct the annotated link states for.
	 * @param clickHandler The click handler for the links.
	 * @param mouseOverHandler The mouse over handler for the links.
	 * @returns The annotated link states.
	 */
	private async *constructAnnotatedLinkStates(
		file: TFile,
		clickHandler: LinkEventHandler,
		mouseOverHandler: LinkEventHandler
	): AsyncGenerator<PrefixedLinkState> {
		const generator =
			this.plugin.annotatedLinksManager!.searchAnnotatedLinks(file);
		for await (const link of generator) {
			yield new PrefixedLinkState({
				prefix: link.annotation,
				link: new NavigationLinkState({
					destinationPath: link.destinationPath,
					displayText: this.getDisplayText(link.destinationPath),
					resolved: true,
					clickHandler,
					mouseOverHandler,
				}),
			});
		}
	}

	/**
	 * Gets the display text for the specified destination path.
	 * If `manualDisplayText` is specified, it is used first.
	 * If `propertyNameForDisplayText` is specified, the property value is used next.
	 * If appropriate text is not found, the title of the destination path is used.
	 * @param destinationPath The destination path.
	 * @param manualDisplayText The manual display text (e.g., from `[[path|display]]`).
	 * @returns The display text.
	 */
	private getDisplayText(
		destinationPath: string,
		manualDisplayText?: string
	): string {
		if (manualDisplayText) {
			return manualDisplayText;
		}

		const propertyName = this.plugin.settings!.propertyNameForDisplayText;
		if (propertyName) {
			const linkedFile =
				this.plugin.app.vault.getFileByPath(destinationPath);
			if (linkedFile) {
				const values = getStringValuesFromFileProperty(
					this.plugin.app,
					linkedFile,
					propertyName
				);
				if (values.length > 0) {
					return values[0];
				}
>>>>>>> e2e2afd (Add folder link feature)
			}

			// If both are property links, sort by the order in propertyMappings
			if (a.isPropertyLink && b.isPropertyLink) {
				const propertyNames = this.plugin.settings!.propertyMappings.map(m => m.property);
				const indexA = propertyNames.indexOf(a.annotation!);
				const indexB = propertyNames.indexOf(b.annotation!);
				return indexA - indexB;
			}

			// If both are annotated links, sort by the order of annotation strings
			const annotationStrings = this.plugin.settings!.annotationStrings.split(",");
			const indexA = annotationStrings.indexOf(a.annotation!);
			const indexB = annotationStrings.indexOf(b.annotation!);
			if (indexA !== indexB) {
				return indexA - indexB;
			}

			// Finally, sort alphabetically by title
			return a.title.localeCompare(b.title);
		});

		return linkStates;
	}

	private getPeriodicNoteLinkStates(
		file: TFile,
		hoverParent: Component
	): PeriodicNoteLinkStates | undefined {
		const filePath = file.path;

		const periodicNoteLinks =
			this.plugin.periodicNotesManager?.searchAdjacentNotes(file);

		if (!periodicNoteLinks) {
			return undefined;
		}

		const convert = (
			path: string,
			date: Moment | undefined,
			granularity: IGranularity | undefined
		): NavigationLinkState => {
			if (path) {
				return new NavigationLinkState({
					enabled: true,
					destinationPath: path,
					fileExists: date === undefined,
					clickHandler: (target, e) => {
						if (target.fileExists) {
							void this.plugin.app.workspace.openLinkText(
								target.destinationPath!,
								filePath,
								e.ctrlKey
							);
						} else {
							if (this.plugin.settings!.confirmFileCreation) {
								new FileCreationModal(
									this.plugin,
									target.title,
									() => {
										void createPeriodicNote(
											granularity!,
											date!
										);
									}
								).open();
							} else {
								void createPeriodicNote(granularity!, date!);
							}
						}
					},
					mouseOverHandler: (target, e) => {
						if (target.fileExists) {
							this.plugin.app.workspace.trigger("hover-link", {
								event: e,
								source: "nav-link-header",
								hoverParent,
								targetEl: e.target,
								linktext: target.destinationPath,
								sourcePath: filePath,
							});
						}
					},
				});
			} else {
				return new NavigationLinkState({
					enabled: false,
				});
			}
		};

		return {
			previous: convert(
				periodicNoteLinks.previousPath,
				undefined,
				undefined
			),
			next: convert(periodicNoteLinks.nextPath, undefined, undefined),
			up: convert(
				periodicNoteLinks.upPath,
				periodicNoteLinks.upDate,
				periodicNoteLinks.upGranularity
			),
		};
	}

	public onunload(): void {
		if (this.navigation) {
			void unmount(this.navigation);
			this.navigation = undefined;
		}
		this.currentFilePath = undefined;
		this.loaded = false;
	}
}
