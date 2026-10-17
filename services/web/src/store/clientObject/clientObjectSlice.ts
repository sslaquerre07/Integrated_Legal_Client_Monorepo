// state
interface ClientObjectState {
	type: ClientFileState | ClientFolderState
}

interface ClientFileState {
    id: string;
	name: string;
	date_uploaded: Date;
}

interface ClientFolderState {
	name: string;
	children: ClientObjectState[];
}

// Initial State