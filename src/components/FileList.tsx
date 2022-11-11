import fileSize from '@contexis/filesize';
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

	const getFullFileSize = (): { value: number, unit: string } => {
		let sum = 0;
		files.forEach((file) => {
			sum += file.size
		})
		return fileSize(sum)
	}

	const singleFile = () => {
		return <ul className='list'>
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
	}


	return (
		<div className={"order " + (showList ? 'order--open' : '')}>
			{files.length === 1 && singleFile()}
			{files.length > 1 &&
				<div className=''>
					<div className="order__header">
						<div><h4>{files.length} <FormattedMessage id="files" values={{ count: files.length }} defaultMessage="{count, plural, =0 {no File} one {File} other {Files}}"></FormattedMessage></h4>
							<small>
								<FormattedMessage id="allinall" values={{ count: files.length }} defaultMessage="All in all"></FormattedMessage> &nbsp;
								<FormattedNumber value={getFullFileSize().value} unit={getFullFileSize().unit} style="unit" maximumSignificantDigits={3} />
							</small>
						</div>
						<button onClick={() => { setShowList(!showList) }} className='button button--primary'>
							{!showList && <FormattedMessage id="downloadsButton" values={{ count: files.length }} defaultMessage="Downloads"></FormattedMessage>}
							{showList && <FormattedMessage id="close" values={{ count: files.length }} defaultMessage="Close"></FormattedMessage>}
						</button>
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