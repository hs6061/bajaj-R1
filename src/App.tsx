import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

type OptionType = { value: string; label: string };
type ResponseType = {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
};

const options: OptionType[] = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highest_alphabet', label: 'Highest Alphabet' },
];

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);


  useEffect(() => {
    document.title = "RA2111031010047";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      console.log(parsedInput);
      const backend = process.env.REACT_APP_BACKEND_URL!;
      const result = await axios.post<ResponseType>(backend, parsedInput);
      setResponse(result.data);
      setError('');
    } catch (e) {
      setError('Invalid JSON input');
      setResponse(null);
    }
  };

  const handleSelectChange = (selected: any) => {
    setSelectedOptions(selected);
  };

  const filteredResponse = () => {
    if (!response) return null;
    let filtered: { [key: string]: string[] } = {};
    selectedOptions.forEach(option => {
      filtered[option.label] = response[option.value as keyof ResponseType] as string[];
    });
    return filtered;
  };

  return (
    <div className="p-8">
      <div className="mb-4">
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder='Enter JSON input here, e.g. { "data": ["A","C","z"] }'
        />
        <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>
      {response && (
        <div className="mb-4">
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className="mb-4"
          />
          <div>
            {filteredResponse() && (
              <div>
                {selectedOptions.map(option => (
                  <div key={option.value} className="mb-2">
                    <strong>{option.label}:</strong> {response[option.value as keyof ResponseType].toString()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
