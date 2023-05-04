<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContractResource;
use App\Models\Contract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index()
    {
        return ContractResource::collection(Contract::all());
    }

    public function show($id)
    {
        return new ContractResource(Contract::findOrFail($id));
    }

    public function store(Request $request)
    {
        $stored = Contract::create($request->all());
        return new ContractResource($stored);
    }

    public function destroy($id) {
        $contract = Contract::find($id);
        $contract->delete();
    }
}
