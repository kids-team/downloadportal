const cleanId = (id: string) => {
	return id.replace(/\/+$/, '').replace('/', ':');
}

export default cleanId