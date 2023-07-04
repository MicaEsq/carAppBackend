import { event } from 'jquery';
import { useState } from 'react';

function RegisterPage(){
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    if(event.target.name === 'username'){
        setUsername(event.target.value);
    }
    else if(event.target.name === 'email'){
        setEmail(event.target.value);
    }
    else if(event.target.name ==='name'){
        setName(event.target.value);
    }
    else if(event.target.name === 'password'){
        setPassword(event.target.value);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    let url = 'http://localhost:3001/register';
    let method = 'POST';
    let msgError = "Error, the password or username is invalid.";
    let data = {username: username, password: password, name:name, email:email};

    var requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };
    
    
    fetch(url, requestOptions)
    .then(response => {
        if (response.ok){
            return Promise.all([response.ok, response.json()]);
        }
        else{
            return response.text().then(text => {throw new Error(text)});
        }
    })
    .then(() => {

        // Reset the form fields
        setUsername('');
        setName('');
        setEmail('');
        setPassword('');

        window.location.replace('/login');
        
    })
    .catch((error) => {
        setError(error.message);
    });

    
  };

  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="favicon.ico"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="/login" method="POST">
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Fullname
                </label>
                <div className="mt-2">
                <input
                    id="name"
                    name="name"
                    type="name"
                    required
                    className="block w-full rounded-md border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Username
                </label>
                <div className="mt-2">
                <input
                    id="username"
                    name="username"
                    type="username"
                    required
                    className="block w-full rounded-md border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                </label>
                <div className="mt-2">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                />
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                </label>
                <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-500 hover:text-indigo-400">
                    Forgot password?
                    </a>
                </div>
                </div>
                <div className="mt-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border py-1.5 pl-3 text-gray-900 shadow-sm border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleSubmit}
                >
                Sign in
                </button>
            </div>
        </form>
      </div>
    </div>
  </>
  );
};

export default RegisterPage;