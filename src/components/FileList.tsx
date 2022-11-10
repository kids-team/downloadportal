import { useContext, useState } from 'react';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import { getUrl } from '../services/api';
import { DokuFile } from '../services/models/article';
import { store } from '../services/store';
import FileIcon from './FileIcon';

type Props = {
	files: Array<DokuFile>
}


const FileList = (props: Props) => {

	const { files } = props;
	const { state } = useContext(store)
	const [showList, setShowList] = useState(false)

	const fileSize = (bytes: number): { value: number, unit: string } => {
		const thresh = 1024;

		if (Math.abs(bytes) < thresh) {
			return { value: bytes, unit: 'byte' };
		}

		const units = ['kilobyte', 'megabyte', 'gigabyte', 'terrabyte'];
		let u = -1;
		const r = 10 ** 1;

		do {
			bytes /= thresh;
			++u;
		} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


		return { value: bytes, unit: units[u] }
	}




	return (
		<div className={"order " + (showList ? 'order--open' : '')}>
			{files.length === 1 && <>
				<ul className='list'>
					<div className="list__item">
						<FileIcon size={16} className="list__image list__image--edgy list__image--small" extension={files[0].extension} />
						<div className='list__content'>
							<span className='list__title text--black'>{files[0].filename}</span>
							<span className='list__subtitle'>
								<FormattedMessage id="changed" defaultMessage="Changed" />: &nbsp;
								<FormattedDate day="numeric" year="numeric" month='long' value={new Date(files[0].modified.date.replace('-', '/'))} />
							</span>

						</div>
						<div className='list__actions'>
							<a className="button button--primary" href={getUrl(files[0].src, { lang: state.lang })}>Download</a>
						</div>
					</div>
				</ul>
			</>}
			{files.length > 1 &&
				<div className=''>
					<div className="order__header">
						<h4>{files.length} <FormattedMessage id="downloads" values={{ count: files.length }} defaultMessage="{count, plural, =0 {Keine Download} one {Download} other {Downloads}}"></FormattedMessage></h4>
						<button onClick={() => { setShowList(!showList) }} className='button button--icon button--round button--primary'><i className='material-icons'>keyboard_arrow_down</i></button>
					</div>
					<ul className='list order__list'>
						{files?.map((file, key) => {
							if (file.extension.includes('jpg')) return <></>
							const size = fileSize(file.size)
							console.log(size)
							return <a key={key} className='list__item' href={getUrl(file.src, { lang: state.lang })}>
								<FileIcon size={16} className="list__image list__image--edgy list__image--small" extension={file.extension} />
								<div className='list__content'>
									<span className='list__title text--black'>{file.filename}</span>
									<span className='list__subtitle'>
										<FormattedNumber value={size.value} unit={size.unit} style="unit" maximumSignificantDigits={3} />,
										<FormattedMessage id="changed" defaultMessage="Changed" />: &nbsp;
										<FormattedDate day="numeric" year="numeric" month='long' value={new Date(file.modified.date.replace('-', '/'))} />
									</span>
								</div>
							</a>
						})}
					</ul>
				</div>
			}
		</div>)
}

export default FileList