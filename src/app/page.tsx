'use client'

import { useAppDispatch, useAppSelector } from '../core/store/hooks'
import { sampleActions } from '../features/sample/sampleReducer'

export default function Home() {
  const dispatch = useAppDispatch()
  const { value, pokemon, test } = useAppSelector((state) => state.sampleReducer)

  const handleDecrement = () => {
    dispatch(sampleActions.decrement({}))
  }

  const handleSetValue = () => {
    dispatch(sampleActions.setValue(10))
  }

  const handleGetPokemon = () => {
    dispatch(sampleActions.getPokemon({}))
  }

  const handleGetTest = () => {
    dispatch(sampleActions.getTest({
      param1: 'test',
      param2: 123
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Redux Maker 예시</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">로컬 상태</h2>
            <p className="text-gray-600">값: {value}</p>
            
            <div className="mt-3 space-x-2">
              <button
                onClick={handleDecrement}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                감소
              </button>
              <button
                onClick={handleSetValue}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                값 설정 (10)
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Pokemon API</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                로딩: {pokemon?.loading ? '로딩 중...' : '완료'}
              </p>
              <p className="text-gray-600">
                에러: {pokemon?.error ? pokemon.errorMsg : '없음'}
              </p>
              <p className="text-gray-600">
                데이터: {pokemon?.data ? JSON.stringify(pokemon.data) : '없음'}
              </p>
            </div>
            
            <button
              onClick={handleGetPokemon}
              className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Pokemon 가져오기
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Test API</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                로딩: {test?.loading ? '로딩 중...' : '완료'}
              </p>
              <p className="text-gray-600">
                에러: {test?.error ? test.errorMsg : '없음'}
              </p>
              <p className="text-gray-600">
                데이터: {test?.data ? JSON.stringify(test.data) : '없음'}
              </p>
            </div>
            
            <button
              onClick={handleGetTest}
              className="mt-3 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
            >
              Test API 호출
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
