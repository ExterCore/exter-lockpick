-- Function to play success sound
function PlaySuccessSound()
    PlaySoundFrontend(-1, "Hack_Success", "DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS", false)
end

-- Function to play failure sound
function PlayFailureSound()
    PlaySoundFrontend(-1, "Hack_Failed", "DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS", false)
end


local Callbackk

RegisterNUICallback('callback', function(data, cb)
    SetNuiFocus(false, false)
    Callbackk(data.success)
    cb('ok')
end)


function OpenDevice(successCallback, target, time)
    SetNuiFocus(true, true)
    time = 50  -- This sets a fixed time, ensure this is the intended logic
    SendNUIMessage({type = "open", target = target, time = time})

    -- Set up the callback function for when the lockpicking operation is completed
    Callbackk = function(success)
        if success then
            PlaySuccessSound()
            successCallback(true)  -- Call the success callback with true
        else
            PlayFailureSound()
            successCallback(false)  -- Call the success callback with false
        end
    end
end


RegisterCommand("hack",function(source, args, raw)
    OpenDevice(function(success)
        if success then
            print("Successful")
        else
            print("Failed")
        end
    end, tonumber(args[1]), tonumber(args[2]))
end)

-- Export the OpenDevice function
exports("OpenLockpickMinigame", OpenDevice)