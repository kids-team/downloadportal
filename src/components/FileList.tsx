import { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { getUrl } from '../services/api';
import { DokuFile } from '../services/models/article';
import { store } from '../services/store';
import FileIcon from './FileIcon';

type Props = {
	files?: Array<DokuFile>
}


const FileList = (props: Props) => {

	const { files } = props;
	const { state } = useContext(store)

	const fileSize = (bytes: number): string => {
		const thresh = 1024;

		if (Math.abs(bytes) < thresh) {
		  return bytes + ' B';
		}
	  
		const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		let u = -1;
		const r = 10**1;
	  
		do {
		  bytes /= thresh;
		  ++u;
		} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
	  
	  
		return bytes.toFixed(1) + ' ' + units[u];
	}

	const dateFromUnix = (value: string | number) => {
		if(typeof value == 'string') value = parseInt(value);
		return new Date(value * 1000);
	}

	return (
		<ul className='list'>
			{ files?.map((file, key) => { 
				return <a key={key} className='list__item' href={getUrl(file.src, {lang: state.lang})}>
					<FileIcon size={16} className="list__image list__image--edgy list__image--small" extension={file.extension}/>
					<div className='list__content'>
						<span className='list__title text--black'>{file.filename}</span>
						<span className='list__subtitle'>{fileSize(file.size)}, <FormattedMessage id="changed" defaultMessage="Changed"/>: <FormattedDate day="numeric" year="numeric" month='long' value={new Date(file.modified.date)}/></span>
					</div>
					</a>
			}) }
		</ul>
	)
}

export default FileList