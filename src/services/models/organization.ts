export type Organization = {
	domain: string,
    home: string,
    donate: string,
	name: string
}

export type OrganizationAction = { type: 'SET_ORGANIZATION', payload: Organization[]}